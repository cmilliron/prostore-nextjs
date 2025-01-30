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
import { Order, ShippingAddress, OrderItem } from "@/types";
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
          <OrderItemTable orderItems={orderItems} />
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

function OrderItemTable({ orderItems }: { orderItems: OrderItem[] }) {
  return (
    <Card>
      <CardContent className="p-2 gap-4">
        <h2 className="text-xl pb-4">Order Items</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Quanity</TableHead>
              <TableHead>Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.slug}>
                <TableCell>
                  <Link
                    href={`/product/${item.slug}`}
                    className="flex items-center"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={50}
                      height={50}
                    />
                    <span className="px-2">{item.name}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <span className="px-2">{item.qty}</span>
                </TableCell>
                <TableCell>
                  <span className="text-right">
                    {formatCurrency(item.price)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
