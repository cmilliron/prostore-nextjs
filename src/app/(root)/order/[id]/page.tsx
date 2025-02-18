import { getOrderById } from "@/lib/actions/order.actions";
import { notFound } from "next/navigation";
import { Order, ShippingAddress } from "@/types";
import { Metadata } from "next";
import OrderDetailsTable from "./order-details-table";
import { getCurrentSession } from "@/lib/actions/auth-actions";

export const metadata: Metadata = {
  title: "Order Details",
};

export default async function OrderDetailsPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const { id } = params;
  const session = await getCurrentSession();

  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <>
      <OrderDetailsTable
        order={{
          ...order,
          shippingAddress: order.shippingAddress as ShippingAddress,
        }}
        paypalClientId={process.env.PAYPAL_CLIENT_ID || "sb"}
        isAdmin={session?.user.role === "admin" || false}
      />
    </>
  );
}
