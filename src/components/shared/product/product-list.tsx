import { Product } from "@/types";
import ProductCard from "./product-card";

export default function ProductList({
  data,
  title,
}: {
  data: Product[];
  title?: string;
}) {
  // const limitedData = limit ? data.slice(0, limit) : data;

  return (
    <div className="my-10">
      <h2 className="h2-bold mb-4">{title}</h2>
      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {data.map((product: Product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div>
          <p>No Product found</p>
        </div>
      )}
    </div>
  );
}
