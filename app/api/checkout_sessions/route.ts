import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil",
});

export async function POST(req: NextRequest) {
  try {
    const { amount, bookingData } = await req.json();
    console.log("[Stripe Checkout] Request body:", { amount, bookingData });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "DKK", // Make sure this matches your Stripe currency support
            product_data: { name: "Villa Booking" },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cancel`,
      metadata: {
        bookingData: JSON.stringify(bookingData),
      },
    });

    console.log("[Stripe Checkout] Checkout session created:", session.id);
    return new Response(JSON.stringify({ id: session.id }), { status: 200 });
  } catch (error: any) {
    console.error("[Stripe Checkout] Error creating session:", error.message, error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
