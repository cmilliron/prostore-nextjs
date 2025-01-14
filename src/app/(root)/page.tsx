import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/products-actions";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function Homepage() {
  const latestProducts = await getLatestProducts();

  return (
    <div className="space-y-8">
      <h2 className="h2-bold">Latest Products</h2>
      <ProductList title="Newest Arrivals" data={latestProducts} />
    </div>
  );
}
