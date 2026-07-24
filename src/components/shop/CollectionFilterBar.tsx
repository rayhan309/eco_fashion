"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Collection } from "@/types/collection";

type CollectionFilterBarProps = {
  collections: Collection[];
};

export function CollectionFilterBar({ collections }: CollectionFilterBarProps) {
  const pathname = usePathname();
  const isAllActive = pathname === "/collections";

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
      <div className="flex w-max min-w-full items-center gap-2 pb-1 sm:w-full sm:flex-wrap">
        <Link
          href="/collections"
          className={`rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors ${
            isAllActive
              ? "border-[#1f6f5b] bg-[#1f6f5b] text-white"
              : "border-[rgba(32,49,45,0.12)] bg-white text-[#20312d] hover:border-[#1f6f5b] hover:text-[#1f6f5b]"
          }`}
        >
          All collections
        </Link>

        {collections.map((collection) => {
          const href = `/collections/${collection.slug}`;
          const active = pathname === href;

          return (
            <Link
              key={collection.id}
              href={href}
              className={`rounded-md border px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                active
                  ? "border-[#1f6f5b] bg-[#1f6f5b] text-white"
                  : "border-[rgba(32,49,45,0.12)] bg-white text-[#20312d] hover:border-[#1f6f5b] hover:text-[#1f6f5b]"
              }`}
            >
              {collection.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
