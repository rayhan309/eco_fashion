import type { ReactNode } from "react";
import { CategoryFilterBar } from "@/components/shop/CategoryFilterBar";
import { getCategories } from "@/services/categories";

type ShopLayoutProps = {
  children: ReactNode;
};

export default async function ShopLayout({ children }: ShopLayoutProps) {
  const categories = await getCategories();

  return (
    <div className="flex flex-1 flex-col gap-6 md:gap-8">
      <div className="rounded-md border border-[rgba(32,49,45,0.08)] bg-white px-4 py-4 sm:px-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold tracking-[0.14em] text-[#61716a] uppercase">
              Browse
            </p>
            <p className="mt-0.5 text-sm font-bold text-[#20312d]">Shop by category</p>
          </div>
          <p className="hidden text-xs text-[#61716a] sm:block">
            {categories.length} categories
          </p>
        </div>
        <CategoryFilterBar categories={categories} />
      </div>

      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
