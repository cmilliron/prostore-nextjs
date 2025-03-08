import { Button } from "@/components/ui/button";
import { SERVER_URL } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import {
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTheme } from "next-themes";
import { FormEvent, useState } from "react";

export default function StripePayment({
  priceInCents,
  orderId,
  clientSecret,
}: {
  priceInCents: number;
  orderId: string;
  clientSecret: string;
}) {
  const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
  );
  const { theme, systemTheme } = useTheme();

  const StripForm = () => {
    const stripe = useStripe();
    const elelments = useElements();
    const [isloading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [email, setEmail] = useState<string>();
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-xl">Strip Checkout</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
      </form>
    );
  };
  return (
    <div>
      <h1>StripPayment</h1>
    </div>
  );
}
