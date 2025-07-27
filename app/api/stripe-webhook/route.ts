// app/api/stripe-webhook/route.ts
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil",
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

export async function POST(req: NextRequest) {
  // Log request received
  console.log("[Webhook] Received Stripe webhook request");

  const sig = req.headers.get("stripe-signature") as string;
  const buf = Buffer.from(await req.arrayBuffer());

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
    console.log("[Webhook] Stripe event constructed successfully:", event.type);
  } catch (err: any) {
    console.error("[Webhook] Stripe signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    console.log("[Webhook] checkout.session.completed event received");

    const session = event.data.object as Stripe.Checkout.Session;
    const bookingData = session.metadata?.bookingData
      ? JSON.parse(session.metadata.bookingData)
      : null;

    // Log booking data presence and value
    if (bookingData) {
      console.log("[Webhook] bookingData found:", bookingData);

      // Place your booking API call here (uncomment in prod)
      // const bookingRes = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/bookings`, {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify(bookingData),
      // });
      // console.log("[Webhook] Booking API response status:", bookingRes.status);
    } else {
      console.warn("[Webhook] No bookingData found in session metadata");
    }
  } else {
    // Log other event types for monitoring
    console.log("[Webhook] Event type ignored:", event.type);
  }

  return new Response("Webhook received", { status: 200 });
}
