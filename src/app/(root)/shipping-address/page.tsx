import { getCurrentSession } from "@/lib/actions/auth-actions";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getUserById } from "@/lib/actions/users.actions";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { ShippingAddress } from "@/types";

export const metadata: Metadata = {
  title: "Shipping Address",
};

export default async function ShippingAddressPage() {
  const cart = await getMyCart();

  if (!cart || cart.items.length === 0) redirect("/cart");

  const session = await getCurrentSession();

  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User ID not found");
  }

  const user = await getUserById(userId);

  return <>Shipping Page</>;
}
