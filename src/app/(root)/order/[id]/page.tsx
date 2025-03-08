import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { Order, ShippingAddress } from "@/types";
import { Metadata } from "next";
import OrderDetailsTable from "./order-details-table";
import { getCurrentSession } from "@/lib/actions/auth-actions";
import Strip from "stripe";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  const session = await getCurrentSession();

  let client_sercret = null;

  const order = await getOrderById(id);

  if (!order) notFound();

  // Check if using Strip and not paid
  if (order.paymentMethod === "Stripe" && !order.isPaid) {
    // Initialize Strip instance
    const stripe = new Strip(process.env.STRIPE_SECRET_KEY as string);

    // Create payment intent

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100),
      currency: "USD",
      metadata: { orderId: order.id },
    });

    client_sercret = paymentIntent.client_secret;
  }

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        stripeClientSecret={client_sercret}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={session?.user.role === "admin" || false}
      />
    </>
  );
}
