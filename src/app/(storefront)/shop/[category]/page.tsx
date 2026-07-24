import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shop/PageHeader";
import { ProductListingGrid } from "@/components/shop/ProductListingGrid";
import { getCategoryBySlug } from "@/services/categories";
import { getProductsByCategory } from "@/services/products";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = await params;
  const category = await getCategoryBySlug(categorySlug);

  if (!category) notFound();

  const products = await getProductsByCategory(category.slug);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title={category.title}
        description={`Explore ${category.title.toLowerCase()} from Eco Fashion — selected for fit, fabric, and everyday wear.`}
        countLabel={`${products.length} products`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: category.title },
        ]}
      />

      <ProductListingGrid
        products={products}
        emptyTitle={`No ${category.title.toLowerCase()} yet`}
        emptyDescription="New pieces are on the way. Check another category for now."
      />
    </div>
  );
}
