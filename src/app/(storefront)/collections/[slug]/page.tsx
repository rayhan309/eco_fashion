import Image from "next/image";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shop/PageHeader";
import { ProductListingGrid } from "@/components/shop/ProductListingGrid";
import {
  getCollectionBySlug,
  getCollectionProductsBySlug,
} from "@/services/collections";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) notFound();

  const products = await getCollectionProductsBySlug(slug);

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <div className="relative overflow-hidden rounded-md">
        <div className="relative aspect-[21/9] min-h-[180px] sm:min-h-[220px]">
          <Image
            src={collection.image}
            alt={collection.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/15" />
          <div className="absolute inset-0 flex flex-col justify-end p-5 sm:p-8">
            <p className="text-xs font-semibold tracking-[0.16em] text-white/75 uppercase">
              Collection
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-4xl">
              {collection.title}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/90 sm:text-base">
              {collection.description}
            </p>
          </div>
        </div>
      </div>

      <PageHeader
        title={`${collection.title} products`}
        countLabel={`${products.length} products`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections" },
          { label: collection.title },
        ]}
      />

      <ProductListingGrid
        products={products}
        emptyTitle="No products in this collection"
        emptyDescription="We’re refreshing this edit. Browse other collections meanwhile."
      />
    </div>
  );
}
