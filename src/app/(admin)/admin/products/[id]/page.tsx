import { Metadata } from "next";
import { notFound } from "next/navigation";

import ProductForm from "@/components/shared/admin/product-form";
import { getProductById } from "@/lib/actions/products-actions";

export const metadata: Metadata = {
  title: "Update product",
};

export default async function UpdateProductPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;

  const product = await getProductById(id);

  if (!product) return notFound();

  return (
    <div className="space-y-3 max-w-5xl mx-auto">
      <h1 className="h2-bold">Update Products</h1>
      <ProductForm type="Update" product={product} productId={product.id} />
    </div>
  );
}
