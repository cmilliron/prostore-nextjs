"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Order, ShippingAddress } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default function OrderDetailsTable({ order }: { order: Order }) {
  const { toast } = useToast();

  const {
    shippingAddress,
    orderItems,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isPaid,
    paidAt,
    isDelivered,
    deliveredAt,
  } = order;

  return (
    <>
      <h1 className="py-4 text-2xl">Order {formatId(order.id)}</h1>
      <div className="grid md:grid-cols-3 md:gap-5">
        <div className="overflow-x-auto md:col-span-2 space-y-4">
          <PaymentCard
            paymentMethod={paymentMethod}
            isPaid={isPaid}
            paidAt={paidAt}
          />
          <ShippingAddressCard
            shippingAddress={shippingAddress}
            isDelivered={isDelivered}
            deliveredAt={deliveredAt}
          />
        </div>
      </div>
    </>
  );
}

function PaymentCard({
  paymentMethod,
  isPaid,
  paidAt,
}: {
  paymentMethod: string;
  isPaid: boolean;
  paidAt: Date | null;
}) {
  return (
    <Card>
      <CardContent className="p-4 gap-4">
        <h2 className="text-xl pb-4">Payment Method</h2>
        <p className="pb-2">{paymentMethod}</p>
        {isPaid ? (
          <Badge variant="secondary">
            Paid at {formatDateTime(paidAt!).dateTime}
          </Badge>
        ) : (
          <Badge variant="destructive">Not Paid</Badge>
        )}
      </CardContent>
    </Card>
  );
}

function ShippingAddressCard({
  shippingAddress,
  isDelivered,
  deliveredAt,
}: {
  shippingAddress: ShippingAddress;
  isDelivered: boolean;
  deliveredAt: Date | null;
}) {
  return (
    <Card>
      <CardContent className="p-3 gap-4">
        <h2 className="text-xl pb-4">Shipping Address</h2>
        <p>{shippingAddress.fullName}</p>
        <p className="pb-2">
          {shippingAddress.streetAddress}, {shippingAddress.city},{" "}
          {shippingAddress.postalCode}, {shippingAddress.country}{" "}
        </p>
        {isDelivered ? (
          <Badge variant="secondary">
            Delivered at {formatDateTime(deliveredAt!).dateTime}
          </Badge>
        ) : (
          <Badge variant="destructive">Not delivered</Badge>
        )}
      </CardContent>
    </Card>
  );
}
