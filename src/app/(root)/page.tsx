import sampleData from "@/db/sample-data";
import ProductList from "@/components/shared/product/product-list";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function Homepage() {
  // await delay(2000);
  return (
    <div className="space-y-8">
      <h2 className="h2-bold">Latest Products</h2>
      <ProductList
        title="Newest Arrivals"
        data={sampleData.products}
        limit={4}
      />
    </div>
  );
}
