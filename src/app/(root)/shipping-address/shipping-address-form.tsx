"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { ShippingAddress } from "@/types";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { shippingAddressSchema } from "@/lib/validators";
import { ControllerRenderProps } from "react-hook-form";
import { shippingAddressDefaultValues } from "@/lib/constants";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";
import { updateUserAddress } from "@/lib/actions/users.actions";
import CheckOutSteps from "@/components/shared/checkout-steps";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader } from "lucide-react";

export default function ShippingAddressForm({
  address,
}: {
  address: ShippingAddress | null;
}) {
  const router = useRouter();
  const { toast } = useToast();

  return <>Shipping Form</>;
}
