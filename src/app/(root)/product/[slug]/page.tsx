import { notFound } from "next/navigation";
import ProductPrice from "@/components/shared/product/product-price";
import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProductBySlug } from "@/lib/actions/products-actions";
import ProductImages from "@/components/shared/product/product-image";
import AddToCart from "@/components/shared/product/add-to-cart";
import { getMyCart } from "@/lib/actions/cart.actions";
import { getCurrentSession } from "@/lib/actions/auth-actions";
import ReviewList from "./review-list";
import Rating from "@/components/shared/product/rating";

export default async function ProductDetailsPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const params = await props.params;

  const { slug } = params;
  const product = await getProductBySlug(slug);
  console.log(product);

  if (!product) notFound();

  const cart = await getMyCart();

  const session = await getCurrentSession();
  const userId = session?.user?.id as string;

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
            <Rating value={Number(product.rating)} />
            <p>{product.numReviews} reviews</p>
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
                  <AddToCart
                    cart={cart}
                    item={{
                      productId: product.id,
                      name: product.name,
                      slug: product.slug,
                      price: product.price,
                      qty: 1,
                      image: product.images![0],
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <ReviewList
        userId={userId}
        productId={product.id}
        productSlug={product.slug}
      />
    </section>
  );
}
