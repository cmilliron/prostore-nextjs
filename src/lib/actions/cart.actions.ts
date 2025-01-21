"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { z } from "zod";
import { auth } from "@/auth";
import { formatError } from "../utils";
import { cartItemSchema, insertCartSchema } from "../validators";
import { prisma } from "@/db/prisma";
import { Prisma } from "@prisma/client";
import { convertToPlainObject } from "../utils";
import { CartItem } from "@/types";

export async function addItemToCart(data: CartItem) {
  try {
    // Check for seeion cart cookie
    const sessionCartid = (await cookies()).get("sessionCartId")?.value;
    if (!sessionCartid) throw new Error("Cart Session not found");
    console.log("1");
    // Get session and user ID
    const session = await auth();
    console.log("2");
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // get Cart from database
    const cart = await getMyCart();
    console.log("3");
    // Parse and validate submitted item data
    console.log(data);
    const item = cartItemSchema.parse(data);
    console.log("4");
    // Find product in database
    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    console.log("5");
    if (!product) throw new Error("Product not found");

    // Testing
    console.log({
      "Session Cart Id": sessionCartid,
      "User ID": userId,
      "Item Requested": item,
      "Product Found": product,
      cart: cart,
    });

    return {
      success: true,
      message: "Testing Cart",
    };
  } catch (error) {
    console.log("In addItem To Cart");
    console.log(error);
    return {
      success: false,
      message: formatError(error),
    };
  }
}

// Get user cart from database
export async function getMyCart() {
  // Check for session cart cookie
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  if (!sessionCartId) return undefined;

  // Get session and user ID
  const session = await auth();
  const userId = session?.user?.id;

  //Get user cart from database
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });

  if (!cart) return undefined;

  // Confert to regular jobject and decimals to strings
  return convertToPlainObject({
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  });
}
