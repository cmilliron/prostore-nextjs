import { z } from "zod";
import { FormateNumberWithDecimal } from "./utils";
import { PAYMENT_METHODS } from "./constants";

// Make sure price is formatted with two decimal places
const currency = z
  .string()
  .refine(
    (value) => /^\d+(\.\d{2})?$/.test(FormateNumberWithDecimal(Number(value))),
    "Price must have exactly two decimals places (e.g., 49.99)"
  );

// Schema for inserting a product
export const insertProductsSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at leat 3 characters"),
  category: z.string().min(3, "Category must be at leat 3 characters"),
  brand: z.string().min(3, "Brand must be at leat 3 characters"),
  description: z.string().min(3, "Description must be at leat 3 characters"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, "Product must have at least one image"),
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
  price: currency,
});

// Schema for siging in a user
export const signInFormSchema = z.object({
  email: z
    .string()
    .email("invalid email address")
    .min(3, "Email must be at least 3 characters"),
  password: z.string().min(3, "Password must be at least 3 characters"),
});

// Schema for siging up a user
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name Must be at least 3 characters"),
    email: z
      .string()
      .email("invalid email address")
      .min(3, "Email must be at least 3 characters"),
    password: z.string().min(3, "Password must be at least 3 characters"),
    confirmPassword: z
      .string()
      .min(3, "Password must be at least 3 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords don't match",
    path: ["confirmPassword"],
  });

// Cart Schema
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  qty: z.number().int().nonnegative("Quantity must be a non-negative number"),
  image: z.string().min(1, "Image is required"),
  price: currency,
});

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart id is required"),
  userId: z.string().optional().nullable(),
});

export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

// Payment Schema
export const paymentMethodSchema = z
  .object({
    type: z.string().min(1, "Payment method is required"),
  })
  .refine((data) => PAYMENT_METHODS.includes(data.type), {
    path: ["type"],
    message: "Invalid payment method",
  });

// Insert Order Schema
export const insertOrderSchema = z.object({
  userId: z.string().min(1, "user id required"),
  itemsPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  totalPrice: currency,
  paymentMethod: z.string().refine((data) => PAYMENT_METHODS.includes(data), {
    message: "Invalid payment methods",
  }),
  shippingAddress: shippingAddressSchema,
});

export const insertOrderItemSchema = z.object({
  productId: z.string(),
  slug: z.string(),
  image: z.string(),
  name: z.string(),
  price: currency,
  qty: z.number(),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  email_address: z.string(),
  pricePaid: z.string(),
});

// Users

// Upade Profile Schema
export const updateProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().min(3, "Name must be at least 3 characters"),
});
