import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/products-actions";
import {
  getFeaturedProducts,
  getlatestProducts,
} from "@/lib/actions/products-actions";
import { ProductCarousel } from "@/components/shared/product/product-carousel";
import ViewAllProductsButton from "@/components/view-all-products-button";

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export default async function Homepage() {
  const latestProducts = await getLatestProducts();
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="space-y-8">
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList title="Newest Arrivals" data={latestProducts} />
      <ViewAllProductsButton />
    </div>
  );
}
