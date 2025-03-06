import Pagination from "@/components/shared/pagination";
import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllCategories,
  getAllProducts,
} from "@/lib/actions/products-actions";
import Link from "next/link";
import { prices, ratings, sortOrders } from "@/lib/constants/filters";

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `Search ${isQuerySet ? q : ""}
      ${isCategorySet ? `: Category ${category}` : ""}
      ${isPriceSet ? `: Price ${price}` : ""}
      ${isRatingSet ? `: Rating ${rating}` : ""}`,
    };
  } else {
    return {
      title: `Search Products`,
    };
  }
}

export default async function SearchPage(props: {
  searchParams: Promise<{
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  console.log(q, category, price, rating, sort, page);

  // Get Categories
  const categories = await getAllCategories();

  //   Get Products
  const products = await getAllProducts({
    category,
    query: q,
    price,
    rating,
    page: Number(page),
    sort,
  });

  // Construct filter url
  const getFilterUrl = ({
    c,
    s,
    p,
    r,
    pg,
  }: {
    c?: string;
    s?: string;
    p?: string;
    r?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (pg) params.page = pg;
    if (s) params.sort = s;
    return `/search?${new URLSearchParams(params).toString()}`;
  };

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        {/* Category */}
        <div className="text-xl mt-3 mb-2">Category</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  ("all" === category || "" === category) && "font-bold"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                Any
              </Link>
            </li>
            {categories.map((x) => (
              <li key={x.category}>
                <Link
                  className={`${x.category === category && "font-bold"}`}
                  href={getFilterUrl({ c: x.category })}
                >
                  {x.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        {/* Price Links */}
        <div>
          <div className="text-xl mt-8 mb-2">Price</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${"all" === price && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                Any
              </Link>
            </li>
            {prices.map((p) => (
              <li key={p.value}>
                <Link
                  href={getFilterUrl({ p: p.value })}
                  className={`${p.value === price && "font-bold"}`}
                >
                  {p.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Ratings Links */}
        <div className="">
          <div className="text-xl mt-8 mb-2">Customer Review</div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${"all" === rating && "font-bold"}`}
                href={getFilterUrl({ r: "all" })}
              >
                Any
              </Link>
            </li>
            {ratings.map((r) => (
              <li key={r}>
                <Link
                  href={getFilterUrl({ r: `${r}` })}
                  className={`${r.toString() === rating && "font-bold"}`}
                >
                  {`${r} stars & up`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex items-center">
          {q !== "all" && q !== "" && "Query : " + q}
          {category !== "all" &&
            category !== "" &&
            "    Category : " + category}
          {price !== "all" && price !== "" && "    Price : " + price}
          {rating !== "all" &&
            rating !== "" &&
            "    Rating : " + rating + " & up"}
          &nbsp;
          {(q !== "all" && q !== "") ||
          (category !== "all" && category !== "") ||
          (rating !== "all" && rating !== "") ||
          (price !== "all" && price !== "") ? (
            <Button variant={"link"} asChild>
              <Link href="/search">Clear</Link>
            </Button>
          ) : null}
          <div>
            Sort by{" "}
            {sortOrders.map((s) => (
              <Link
                key={s}
                className={`mx-2 ${sort === s && "font-bold"}`}
                href={getFilterUrl({ s })}
              >
                {s}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products!.data.length === 0 && <div>No product found</div>}
          {products!.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        {products!.totalPages! > 1 && (
          <Pagination page={page} totalPages={products!.totalPages} />
        )}
      </div>
    </div>
  );
}
