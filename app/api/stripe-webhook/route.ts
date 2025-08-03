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
      const userHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Booking Confirmation</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 30px auto;
        background: #fff;
        /* padding: 30px; */
        border-radius: 6px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }
      .header {
        text-align: center;
        padding: 20px 0;
        border-bottom: 1px solid #ddd;
        color: #fff;
        background-color: #53624e;
      }
      .header h1 {
        margin: 0;
      }
      .section {
        margin: 30px 0;
        padding: 0 20px;
      }
      .section h2 {
        font-size: 18px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 8px;
        margin-bottom: 16px;
      }
      .info-table {
        width: 100%;
        border-collapse: collapse;
      }
      .info-table td {
        padding: 8px 0;
      }
      .info-table td:first-child {
        font-weight: bold;
        width: 40%;
        vertical-align: top;
      }
      .footer {
        margin-top: 40px;
        font-size: 14px;
        text-align: center;
        padding: 8px 0;

        color: #888;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Thank you for your booking</h1>
        <p>
          Booking #${booking.id} — ${new Date(
        booking.created_at
      ).toLocaleDateString()}
        </p>
      </div>

      <div class="section">
        <h2>Guest Information</h2>
        <table class="info-table">
          <tr>
            <td>Name</td>
            <td>${booking.first_name} ${booking.last_name}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>${booking.email}</td>
          </tr>
          ${
            booking.phone
              ? `
          <tr>
            <td>Phone</td>
            <td>${booking.phone}</td>
          </tr>
          `
              : ""
          } ${
        booking.mobile
          ? `
          <tr>
            <td>Mobile</td>
            <td>${booking.mobile}</td>
          </tr>
          `
          : ""
      }
          <tr>
            <td>Address</td>
            <td>
              ${booking.address}, ${booking.postal_code} ${booking.city},
              ${booking.country}
            </td>
          </tr>
          ${
            booking.company_name
              ? `
          <tr>
            <td>Company</td>
            <td>${booking.company_name}</td>
          </tr>
          `
              : ""
          } ${
        booking.vat_identification_number
          ? `
          <tr>
            <td>VAT ID</td>
            <td>${booking.vat_identification_number}</td>
          </tr>
          `
          : ""
      }
        </table>
      </div>

      <div class="section">
        <h2>Booking Details</h2>
        <table class="info-table">
          <tr>
            <td>Arrival</td>
            <td>${new Date(booking.arrival).toDateString()}</td>
          </tr>
          <tr>
            <td>Departure</td>
            <td>${new Date(booking.departure).toDateString()}</td>
          </tr>
          <tr>
            <td>Booking Type</td>
            <td>${booking.type}</td>
          </tr>
          <tr>
            <td>Currency</td>
            <td>${booking.currency_code}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>${booking.active_status ? "Confirmed" : "Pending"}</td>
          </tr>
          ${
            booking.cleaning_included
              ? `
          <tr>
            <td>Cleaning Service</td>
            <td>Included</td>
          </tr>
          `
              : ""
          } ${
        booking.bedlinen_amount > 0
          ? `
          <tr>
            <td>Bedlinen</td>
            <td>${booking.bedlinen_amount} set(s)</td>
          </tr>
          `
          : ""
      } ${
        booking.comment
          ? `
          <tr>
            <td>Special Requests</td>
            <td>${booking.comment}</td>
          </tr>
          `
          : ""
      }
        </table>
      </div>

      <div class="footer">
        <p>Have questions? Reach out anytime.</p>
      </div>
    </div>
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
