import { CollectionCard } from "@/components/shop/CollectionCard";
import { PageHeader } from "@/components/shop/PageHeader";
import {
  getCollectionProductsBySlug,
  getCollections,
} from "@/services/collections";

export default async function CollectionsIndexPage() {
  const collections = await getCollections();

  const cards = await Promise.all(
    collections.map(async (collection) => {
      const products = await getCollectionProductsBySlug(collection.slug);
      return { collection, productCount: products.length };
    }),
  );

  return (
    <div className="flex flex-col gap-6 md:gap-8">
      <PageHeader
        title="Collections"
        description="Curated edits for how you dress — essentials, work, weekends, and new season drops."
        countLabel={`${collections.length} collections`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Collections" },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
        {cards.map(({ collection, productCount }) => (
          <CollectionCard
            key={collection.id}
            collection={collection}
            productCount={productCount}
          />
        ))}
      </div>
    </div>
  );
}
