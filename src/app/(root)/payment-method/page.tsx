import { Metadata } from "next";
import { getUserById } from "@/lib/actions/users.actions";
import { getCurrentSession } from "@/lib/actions/auth-actions";
import PaymentMethodForm from "./payment-method-form";

export const metadata: Metadata = {
  title: "Payment Method",
};

export default async function PaymentMethodPage() {
  const session = await getCurrentSession();
  const userId = session?.user?.id;
  if (!userId) throw new Error("user ID not found");

  const user = await getUserById(userId);

  return (
    <>
      <PaymentMethodForm preferredPaymentMethod={user.paymentMethod} />
    </>
  );
}
