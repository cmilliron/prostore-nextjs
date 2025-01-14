import { notFound } from "next/navigation";
import ProductPrice from "@/components/shared/product/product-price";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/actions/products-actions";
import ProductImages from "@/components/shared/product/product-image";

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  return (
    <section>
      <div className="grid gird-cols-1 md:grid-cols-5">
        {/* Image Container */}
        <div className="col-span-2">
          <ProductImages images={product.images!} />
        </div>
        {/* Details Column */}
        <div className="col-span-2 p-5">
          <div className="flex flex-col gap-6">
            <p>
              {product.brand} {product.category}
            </p>
            <h1 className="h3-bold">{product.name}</h1>
            <p>
              {product.rating} out of {product.numReviews} reviews
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <ProductPrice
                value={Number(product.price)}
                className="w-24 rounded-full bg-green-100 text-green-700 px-5 py-2"
              />
            </div>
          </div>
          <div className="mt-10">
            <p>Description:</p>
            <p>{product.description}</p>
          </div>
        </div>
        <div className="">
          <Card>
            <CardContent className="p-4">
              <div className="mb-2 flex justify-between">
                <div className="">Price</div>
                <div className="">
                  <ProductPrice value={Number(product.price)} />
                </div>
              </div>
              <div className="mb-2 flex justify-between">
                <div>Status</div>
                {product.stock > 0 ? (
                  <Badge variant="outline">In Stock</Badge>
                ) : (
                  <Badge variant="destructive">Unavailable</Badge>
                )}
              </div>
              {product.stock > 0 && (
                <div className="flex-center">
                  <Button className="w-full">Add to cart</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
