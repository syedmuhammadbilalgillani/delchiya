export const runtime = "nodejs";

import { PrismaClient } from "@/app/generated/prisma";
import { sendEmail } from "@/lib/sendEmail";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const prisma = new PrismaClient();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  console.log("[Stripe Webhook] Incoming request at", new Date().toISOString());

  // Collect raw body for Stripe signature verification
  const sig = req.headers.get("stripe-signature") as string;
  if (!sig) {
    console.error("[Stripe Webhook] Missing Stripe signature header");
    return new Response("Missing Stripe signature", { status: 400 });
  }
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log("[Stripe Webhook] Stripe event constructed:", event.type);
  } catch (err: any) {
    console.error(
      "[Stripe Webhook] Signature verification failed:",
      err.message
    );
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    console.log("[Stripe Webhook] checkout.session.completed received");
    const session = event.data.object as Stripe.Checkout.Session;

    const meta = session.metadata;
    console.log("[Stripe Webhook] Session metadata:", meta);

    const bookingData = meta?.booking_id;

    if (bookingData) {
      const booking = await prisma.booking.update({
        where: { id: parseInt(bookingData) },
        data: { active_status: true },
      });

      // Prepare email HTML (simple version, customize as needed)
      const userHtml = `
       <!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
        }
        th {
            background-color: #f5f5f5;
        }
        .td {
            padding: 8px;
            vertical-align: top;
        }
        h1, h2 {
            color: #444;
        }
        #header_wrapper {
            background-color: #f8f8f8;
            padding: 20px;
            text-align: center;
        }
        #body_content {
            padding: 20px;
            background-color: #fff;
        }
        #addresses td {
            padding: 15px;
            background-color: #f9f9f9;
        }
        .wc-item-meta, .cs-room-order-wrapper {
            margin: 10px 0;
            padding-left: 0;
            list-style: none;
        }
        .wc-item-meta li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <table id="template_container">
        <tbody>
            <tr>
                <td>
                    <table id="template_header">
                        <tbody>
                            <tr>
                                <td id="header_wrapper">
                                    <h1>Thank you for your booking</h1>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                    <table id="template_body">
                        <tbody>
                            <tr>
                                <td id="body_content">
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <div id="body_content_inner">
                                                        <p>Hi ${
                                                          booking.first_name
                                                        } ${
        booking.last_name
      },</p>
                                                        <p>Your booking has been confirmed. Here are the details:</p>
                                                        <h2>[Booking #${
                                                          booking.id
                                                        }] (${new Date(
        booking.created_at
      ).toLocaleDateString()})</h2>
                                                        <div>
                                                            <table class="td">
                                                                <thead>
                                                                    <tr>
                                                                        <th class="td">Booking Details</th>
                                                                        <th class="td">Information</th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    <tr class="order_item">
                                                                        <td class="td">
                                                                            <ul class="wc-item-meta">
                                                                                <li>
                                                                                    <strong class="wc-item-meta-label">Arrival Date:</strong>
                                                                                    <p>${new Date(
                                                                                      booking.arrival
                                                                                    ).toDateString()}</p>
                                                                                </li>
                                                                                <li>
                                                                                    <strong class="wc-item-meta-label">Departure Date:</strong>
                                                                                    <p>${new Date(
                                                                                      booking.departure
                                                                                    ).toDateString()}</p>
                                                                                </li>
                                                                                ${
                                                                                  booking.company_name
                                                                                    ? `
                                                                                <li>
                                                                                    <strong class="wc-item-meta-label">Company Name:</strong>
                                                                                    <p>${booking.company_name}</p>
                                                                                </li>
                                                                                `
                                                                                    : ""
                                                                                }
                                                                                ${
                                                                                  booking.vat_identification_number
                                                                                    ? `
                                                                                <li>
                                                                                    <strong class="wc-item-meta-label">VAT Identification Number:</strong>
                                                                                    <p>${booking.vat_identification_number}</p>
                                                                                </li>
                                                                                `
                                                                                    : ""
                                                                                }
                                                                            </ul>
                                                                            <div class="cs-room-order-wrapper">
                                                                                <div class="cs-room-order-details">
                                                                                    <strong>Guest Details:</strong>
                                                                                    ${
                                                                                      booking.first_name
                                                                                    } ${
        booking.last_name
      }<br>
                                                                                    Email: ${
                                                                                      booking.email
                                                                                    }<br>
                                                                                    ${
                                                                                      booking.phone
                                                                                        ? `Phone: ${booking.phone}<br>`
                                                                                        : ""
                                                                                    }
                                                                                    ${
                                                                                      booking.mobile
                                                                                        ? `Mobile: ${booking.mobile}<br>`
                                                                                        : ""
                                                                                    }
                                                                                </div>
                                                                                <div class="cs-room-order-address">
                                                                                    <strong>Address:</strong>
                                                                                    ${
                                                                                      booking.address
                                                                                    }<br>
                                                                                    ${
                                                                                      booking.postal_code
                                                                                    } ${
        booking.city
      }<br>
                                                                                    ${
                                                                                      booking.country
                                                                                    }
                                                                                </div>
                                                                                ${
                                                                                  booking.cleaning_included
                                                                                    ? `
                                                                                <div class="cs-room-order-extra">
                                                                                    <strong>Cleaning Service:</strong>
                                                                                    Included
                                                                                </div>
                                                                                `
                                                                                    : ""
                                                                                }
                                                                                ${
                                                                                  booking.bedlinen_amount >
                                                                                  0
                                                                                    ? `
                                                                                <div class="cs-room-order-extra">
                                                                                    <strong>Bedlinen:</strong>
                                                                                    ${booking.bedlinen_amount} set(s)
                                                                                </div>
                                                                                `
                                                                                    : ""
                                                                                }
                                                                                ${
                                                                                  booking.comment
                                                                                    ? `
                                                                                <div class="cs-room-order-extra">
                                                                                    <strong>Special Requests:</strong>
                                                                                    ${booking.comment}
                                                                                </div>
                                                                                `
                                                                                    : ""
                                                                                }
                                                                            </div>
                                                                        </td>
                                                                    </tr>
                                                                </tbody>
                                                                <tfoot>
                                                                    <tr>
                                                                        <th class="td">Booking Type:</th>
                                                                        <td class="td">${
                                                                          booking.type
                                                                        }</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th class="td">Currency:</th>
                                                                        <td class="td">${
                                                                          booking.currency_code
                                                                        }</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th class="td">Status:</th>
                                                                        <td class="td">${
                                                                          booking.active_status
                                                                            ? "Confirmed"
                                                                            : "Pending"
                                                                        }</td>
                                                                    </tr>
                                                                </tfoot>
                                                            </table>
                                                        </div>
                                                        <table id="addresses">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <h2>Billing address</h2>
                                                                        ${
                                                                          booking.first_name
                                                                        } ${
        booking.last_name
      }<br>
                                                                        ${
                                                                          booking.company_name
                                                                            ? `${booking.company_name}<br>`
                                                                            : ""
                                                                        }
                                                                        ${
                                                                          booking.address
                                                                        }<br>
                                                                        ${
                                                                          booking.postal_code
                                                                        } ${
        booking.city
      }<br>
                                                                        ${
                                                                          booking.country
                                                                        }<br>
                                                                        Email: ${
                                                                          booking.email
                                                                        }<br>
                                                                        ${
                                                                          booking.phone
                                                                            ? `Phone: ${booking.phone}<br>`
                                                                            : ""
                                                                        }
                                                                        ${
                                                                          booking.mobile
                                                                            ? `Mobile: ${booking.mobile}`
                                                                            : ""
                                                                        }
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <p>Thank you for choosing us! If you have any questions, please don't hesitate to contact us.</p>
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
      `;

      const adminHtml = `
        <h2>New Booking Confirmed</h2>
        <p>Booking ID: ${booking.id}</p>
        <p>Name: ${booking.first_name} ${booking.last_name}</p>
        <p>Email: ${booking.email}</p>
        <p>Arrival: ${booking.arrival.toDateString()}<br/>
           Departure: ${booking.departure.toDateString()}</p>
      `;

      // Send to user
      await sendEmail({
        to: booking.email,
        subject: "Your Booking is Confirmed",
        html: userHtml,
      });

      // Send to admin
      await sendEmail({
        to: process.env.ADMIN_EMAIL!,
        subject: "New Booking Received",
        html: adminHtml,
      });

      console.log(`[Webhook] Emails sent to ${booking.email} and admin`);
    }
  } else {
    // Log ignored event types
    console.log("[Stripe Webhook] Ignored event type:", event.type);
  }

  return new Response("Webhook received", { status: 200 });
}

// const bookingRes = await fetch("https://api.villavilla.com/partner-api/v1/booking", {
//   method: "POST",
//   headers: {
//     "Accept": "application/json",
//     "Content-Type": "application/json",
//     // Replace process.env.VILLAVILLA_API_TOKEN with your actual token or env variable
//     "Authorization": "Bearer 24|1SGF1LA1L2AGYjUWTOgR0a81i8pyitEnPIERDuEHf2ed5901",
//   },
//   body: JSON.stringify(bookingData),
// });
