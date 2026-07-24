"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types/category";

type CategoryFilterBarProps = {
  categories: Category[];
  basePath?: string;
};

export function CategoryFilterBar({
  categories,
  basePath = "/shop",
}: CategoryFilterBarProps) {
  const pathname = usePathname();
  const isAllActive = pathname === basePath;

  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
      <div className="flex w-max min-w-full items-center gap-2 pb-1 sm:w-full sm:flex-wrap">
        <Link
          href={basePath}
          className={`rounded-md border px-3 py-1.5 text-sm font-semibold transition-colors ${
            isAllActive
              ? "border-[#1f6f5b] bg-[#1f6f5b] text-white"
              : "border-[rgba(32,49,45,0.12)] bg-white text-[#20312d] hover:border-[#1f6f5b] hover:text-[#1f6f5b]"
          }`}
        >
          All
        </Link>

        {categories.map((category) => {
          const href = `${basePath}/${category.slug}`;
          const active = pathname === href || pathname.startsWith(`${href}/`);

          return (
            <Link
              key={category.id}
              href={href}
              className={`rounded-md border px-3 py-1.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                active
                  ? "border-[#1f6f5b] bg-[#1f6f5b] text-white"
                  : "border-[rgba(32,49,45,0.12)] bg-white text-[#20312d] hover:border-[#1f6f5b] hover:text-[#1f6f5b]"
              }`}
            >
              {category.title}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
