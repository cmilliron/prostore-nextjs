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
import {
  PayPalButtons,
  PayPalScriptProvider,
  usePayPalScriptReducer,
} from "@paypal/react-paypal-js";
import {
  approvePayPalOrder,
  createPayPalOrder,
  deliverOrder,
  updateOrderToPaidByCOD,
} from "@/lib/actions/order.actions";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import StripePayment from "./stripe-payment";

export default function OrderDetailsTable({
  order,
  paypalClientId,
  isAdmin,
  stripeClientSecret,
}: {
  order: Order;
  paypalClientId: string;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) {
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
        <div>
          <aside>
            <OrderSummary
              orderId={order.id}
              itemsPrice={itemsPrice}
              taxPrice={taxPrice}
              shippingPrice={shippingPrice}
              totalPrice={totalPrice}
              isPaid={isPaid}
              paymentMethod={paymentMethod}
              paypalClientId={paypalClientId}
              isDelivered={isDelivered}
              isAdmin={isAdmin}
              stripeClientSecret={stripeClientSecret}
            />
          </aside>
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

function OrderSummary({
  itemsPrice,
  taxPrice,
  shippingPrice,
  totalPrice,
  orderId,
  isPaid,
  paymentMethod,
  paypalClientId,
  isDelivered,
  isAdmin,
  stripeClientSecret,
}: {
  itemsPrice: string;
  taxPrice: string;
  shippingPrice: string;
  totalPrice: string;
  orderId: string;
  isPaid: boolean;
  paymentMethod: string;
  paypalClientId: string;
  isDelivered: boolean;
  isAdmin: boolean;
  stripeClientSecret: string | null;
}) {
  const { toast } = useToast();
  // Checks the loading status of the Paypal Script
  function PrintLoadingState() {
    const [{ isPending, isRejected }] = usePayPalScriptReducer();
    let status = "";
    if (isPending) {
      status = "Loading PayPal...";
    } else if (isRejected) {
      status = "Error in laoding PayPal.";
    }
    return status;
  }

  // Creates a PayPal order
  const handleCreatePayPalOrder = async () => {
    const res = await createPayPalOrder(orderId);
    if (!res?.success) {
      return toast({
        description: res?.message,
        variant: "destructive",
      });
    }
    return res.data;
  };

  // Approves a PayPal order
  const handleApprovePayPalOrder = async (data: { orderID: string }) => {
    const res = await approvePayPalOrder(orderId, data);
    toast({
      description: res.message,
      variant: res.success ? "default" : "destructive",
    });
  };

  const MarkAsPaidButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();

    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() =>
          startTransition(async () => {
            const res = await updateOrderToPaidByCOD(orderId);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            });
          })
        }
      >
        {isPending ? "processing" : "Mark As Paid"}
      </Button>
    );
  };

  const MarkAsDeliveredButton = () => {
    const [isPending, startTransition] = useTransition();
    const { toast } = useToast();
    return (
      <Button
        type="button"
        disabled={isPending}
        onClick={() => {
          startTransition(async () => {
            const res = await deliverOrder(orderId);
            toast({
              variant: res.success ? "default" : "destructive",
              description: res.message,
            });
          });
        }}
      >
        {isPending ? "processing..." : "Mark As Delivered"}
      </Button>
    );
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-4 gap-4">
        <h2 className="text-xl pb-4">Order Summary</h2>

        <SummaryItem label="Items" amount={itemsPrice} />
        <SummaryItem label="Tax" amount={taxPrice} />
        <SummaryItem label="Shipping" amount={shippingPrice} />
        <SummaryItem label="Total" amount={totalPrice} />

        {/* 
  // Paypal Payment
*/}
        {!isPaid && paymentMethod === "PayPal" && (
          <div>
            <PayPalScriptProvider options={{ clientId: paypalClientId }}>
              <PrintLoadingState />
              <PayPalButtons
                createOrder={handleCreatePayPalOrder}
                onApprove={handleApprovePayPalOrder}
              />
            </PayPalScriptProvider>
          </div>
        )}
        {/* Stripe Payment */}
        {!isPaid && paymentMethod === "Stripe" && stripeClientSecret && (
          <StripePayment
            priceInCents={Math.round(parseFloat(totalPrice) * 100)}
            orderId={orderId}
            clientSecret={stripeClientSecret}
          />
        )}
        {/* Cash on Delivery */}
        {isAdmin && !isPaid && paymentMethod === "CashOnDelivery" && (
          <MarkAsPaidButton />
        )}
        {isAdmin && isPaid && !isDelivered && <MarkAsDeliveredButton />}
      </CardContent>
    </Card>
  );
}

function SummaryItem({ label, amount }: { label: string; amount: string }) {
  return (
    <div className="flex justify-between">
      <div>{label}</div>
      <div>{formatCurrency(amount)}</div>
    </div>
  );
}
