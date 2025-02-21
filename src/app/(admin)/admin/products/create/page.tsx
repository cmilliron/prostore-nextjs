import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create product",
};

export default function CreateProductPage() {
  return (
    <>
      <h2 className="h2-bold">Create Product</h2>
      <div className="my-8">{/* Product Form goes here */}</div>
    </>
  );
}
