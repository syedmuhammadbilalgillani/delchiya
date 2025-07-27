// app/api/stripe-webhook/route.ts
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  const sig = req.headers.get("stripe-signature") as string;
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingData = session.metadata?.bookingData
      ? JSON.parse(session.metadata.bookingData)
      : null;

    // Example: Call your booking API here
    if (bookingData) {
      debugger;
      //   await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/bookings`, {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify(bookingData),
      //   });
    }
  }

  return new Response("Webhook received", { status: 200 });
}
