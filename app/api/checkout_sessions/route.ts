export const runtime = "nodejs";

import { PrismaClient } from "@/app/generated/prisma";
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil", // use a stable version
});
const prisma = new PrismaClient();

// helper to convert DD-MM-YYYY to Date
function toISODate(input: string): Date {
  const [day, month, year] = input.split("-");
  return new Date(`${year}-${month}-${day}`);
}

export async function POST(req: NextRequest) {
  try {
    const { amount, bookingData } = await req.json();
    console.log("[Stripe Checkout] Request body:", { amount, bookingData });

    const booking = await prisma.booking.create({
      data: {
        house_id: bookingData.house_id,
        language: bookingData.language,
        type: bookingData.type,
        arrival: toISODate(bookingData.arrival),
        departure: toISODate(bookingData.departure),
        company_name: bookingData.company_name,
        vat_identification_number: bookingData.vat_identification_number,
        first_name: bookingData.first_name,
        last_name: bookingData.last_name,
        email: bookingData.email,
        phone: bookingData.phone,
        mobile: bookingData.mobile,
        city: bookingData.city,
        address: bookingData.address,
        postal_code: bookingData.postal_code,
        country: bookingData.country,
        currency_code: parseInt(bookingData.currency_code),
        bedlinen_amount: parseInt(bookingData.bedlinen_amount),
        cleaning_included: bookingData.cleaning_included,
        comment: bookingData.comment,
        active_status: false,
      },
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "dkk",
            product_data: { name: "Blommehuset booking" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: {
        booking_id: booking.id.toString(),
      },
    });

    console.log("[Stripe Checkout] Checkout session created:", session.id);
    return new Response(JSON.stringify({ id: session.id }), { status: 200 });
  } catch (error: any) {
    console.error("[Stripe Checkout] Error creating session:", error.message);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
