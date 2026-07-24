import type { ReactNode } from "react";
import { CollectionFilterBar } from "@/components/shop/CollectionFilterBar";
import { getCollections } from "@/services/collections";

type CollectionsLayoutProps = {
  children: ReactNode;
};

export default async function CollectionsLayout({ children }: CollectionsLayoutProps) {
  const collections = await getCollections();

  return (
    <div className="flex flex-1 flex-col gap-6 md:gap-8">
      <div className="rounded-md border border-[rgba(32,49,45,0.08)] bg-white px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#61716a] uppercase">
              Curated
            </p>
            <p className="mt-0.5 text-sm font-bold text-[#20312d]">Shop by collection</p>
          </div>
          <p className="hidden text-xs text-[#61716a] sm:block">
            {collections.length} collections
          </p>
        </div>
        <CollectionFilterBar collections={collections} />
      </div>

      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
