import Link from "next/link";
import { CollectionProductCard } from "@/components/product/CollectionProductCard";
import type { CategoryProductGroup } from "@/types/catalog";

type CollectionsSectionProps = {
  groups: CategoryProductGroup[];
};

export function CollectionsSection({ groups }: CollectionsSectionProps) {
  const visibleGroups = groups.filter((group) => (group.products?.length ?? 0) > 0);

  if (visibleGroups.length === 0) return null;

  return (
    <div className="flex flex-col gap-10 md:gap-12">
      {visibleGroups.map((group) => (
        <section key={group.category.id} className="w-full">
          <div className="relative mb-6 flex items-center justify-between gap-4 border-b border-[#20312d]">
            <div className="-mb-px bg-[#20312d] py-2.5 pr-7 pl-4 text-sm font-bold tracking-wide text-white [clip-path:polygon(0_0,calc(100%-14px)_0,100%_100%,0_100%)] sm:pl-5 sm:text-base">
              {group.category.title}
            </div>

            <Link
              href={`/shop/${group.category.slug}`}
              className="shrink-0 pb-2 text-sm font-semibold text-[#1f6f5b] transition-colors hover:text-[#185a4a]"
            >
              See all
            </Link>
          </div>

          <div className="grid grid-cols-2 items-start gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-4 lg:grid-cols-5 lg:gap-4">
            {group.products.map((product, index) => (
              <CollectionProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
