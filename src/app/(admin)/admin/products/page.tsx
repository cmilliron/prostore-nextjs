export default async function AdminProductsPage(props: {
  searchPrarms: Promise<{
    page: string;
    query: string;
    category: string;
  }>;
}) {
  const searchParams = await props.searchPrarms;

  const page = Number(searchParams.page) || 1;
  const searchText = searchParams.query || "";
  const category = searchParams.category || "";

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <h1 className="h2-bold">Products</h1>
      </div>
    </div>
  );
}
