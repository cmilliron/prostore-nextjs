import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

// Initialize Stripe instanceusing API key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

// Define the POST handler function for the Stripe webhook
export async function POST(req: NextRequest) {
  // Construct the event using the raw request body, the Stripe signature header, and the webhook secret.
  // This ensures that the request is indeed from Stripe and has not been tampered with.
  const event = await stripe.webhooks.constructEvent(
    await req.text(),
    req.headers.get("stripe-signature") as string,
    process.env.STRIPE_WEBHOOK_SECRET as string
  );

  // charge.succeeded event is triggered when a payment is successfully processed
  if (event.type === "charge.succeeded") {
    // Retrieve the order ID from the paymebnt metadata
    const { object } = event.data;

    // Update the order to paid
    await updateOrderToPaid({
      orderId: object.metadata.orderId,
      paymentResult: {
        id: object.id,
        status: "COMPLETED",
        email_address: object.billing_details.email as string,
        pricePaid: (object.amount / 100).toFixed(2),
      },
    });

    return NextResponse.json({
      message: "updateOrderToPaid was successfull",
    });
  }
  return NextResponse.json({
    message: "event is not charge.succeeded",
  });
}
