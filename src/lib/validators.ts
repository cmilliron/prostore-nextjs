import { z } from "zod";
import { FormateNumberWithDecimal } from "./utils";

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
