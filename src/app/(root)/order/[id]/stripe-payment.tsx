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
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
  );
  const { theme, systemTheme } = useTheme();

  const StripForm = () => {
    const stripe = useStripe();
    const elements = useElements();
    const [isloading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [email, setEmail] = useState<string>();

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
      e.preventDefault();
      if (stripe == null || elements == null || email == null) return;
      setIsLoading(true);
      stripe
        .confirmPayment({
          elements,
          confirmParams: {
            return_url: `${SERVER_URL}/order/${orderId}/stripe-payment-success`,
          },
        })
        .then(({ error }) => {
          if (
            error?.type === "card_error" ||
            error?.type === "validation_error"
          ) {
            setErrorMessage(error?.message ?? "An unkown error occureed.");
          } else if (error) {
            setErrorMessage("An unkown error occureed.");
          }
        })
        .finally(() => setIsLoading(false));
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-xl">Strip Checkout</div>
        {errorMessage && <div className="text-destructive">{errorMessage}</div>}
        <PaymentElement />
        <div>
          <LinkAuthenticationElement
            onChange={(e) => setEmail(e.value.email)}
          />
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={stripe == null || elements == null || isloading}
        >
          {isloading
            ? "Purchasing..."
            : `Purchase = ${formatCurrency(priceInCents / 100)}`}
        </Button>
      </form>
    );
  };
  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme:
            theme === "dark"
              ? "night"
              : theme === "light"
              ? "stripe"
              : systemTheme === "light"
              ? "stripe"
              : "night",
        },
      }}
    >
      <StripForm />
    </Elements>
  );
}
