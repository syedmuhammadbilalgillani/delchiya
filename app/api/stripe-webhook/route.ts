import { NextRequest } from "next/server";
import Stripe from "stripe";

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
    console.error("[Stripe Webhook] Signature verification failed:", err.message);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    console.log("[Stripe Webhook] checkout.session.completed received");
    const session = event.data.object as Stripe.Checkout.Session;

    const meta = session.metadata;
    console.log("[Stripe Webhook] Session metadata:", meta);

    const bookingData = meta?.bookingData
      ? (() => {
          try {
            return JSON.parse(meta.bookingData);
          } catch (e) {
            console.error("[Stripe Webhook] Error parsing bookingData:", e);
            return null;
          }
        })()
      : null;

    if (bookingData) {
      console.log("[Stripe Webhook] bookingData extracted:", bookingData);

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
      // console.log("[Stripe Webhook] Booking API response status:", bookingRes.status);
    } else {
      console.warn("[Stripe Webhook] No valid bookingData found in session metadata");
    }
  } else {
    // Log ignored event types
    console.log("[Stripe Webhook] Ignored event type:", event.type);
  }

  return new Response("Webhook received", { status: 200 });
}
