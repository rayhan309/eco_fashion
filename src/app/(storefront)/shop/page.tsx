import { PageHeader } from "@/components/shop/PageHeader";
import { ProductListingGrid } from "@/components/shop/ProductListingGrid";
import { getProducts } from "@/services/products";

export default async function ShopPage() {
  const products = await getProducts();

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title="Shop"
        description="Browse the full men&apos;s collection — shirts, pants, outerwear, and finishing pieces."
        countLabel={`${products.length} products`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop" },
        ]}
      />

      <ProductListingGrid products={products} />
    </div>
  );
}
