"use client";

import { Cart } from "@/types";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { addItemToCart, removeItemFromCart } from "@/lib/actions/cart.actions";
import { ArrowRight, Loader, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function CartTable({ cart }: { cart?: Cart }) {
  const router = useRouter();
  const toast = useToast();
  const [isPending, startTransition] = useTransition();
  return (
    <>
      <h1 className="py-2 h2-bold">Shopping Cart</h1>
      {!cart || cart.items.length === 0 ? (
        <div>
          Cart is Empty. <Link href="/">Go shopping</Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-4 md:gap-5">
          <div className="overflow-x-auto md:col-span-3"></div>
        </div>
      )}
    </>
  );
}
