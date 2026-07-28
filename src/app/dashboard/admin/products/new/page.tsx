import type { Metadata } from "next";
import { AddProductView } from "@/components/admin/products/AddProductView";
import { getCategories } from "@/services/categories";
import { getProductAttributes } from "@/services/product-attributes";

export const metadata: Metadata = {
  title: "Add product",
};

export default async function AdminAddProductPage() {
  const [categories, attributes] = await Promise.all([
    getCategories(),
    getProductAttributes(),
  ]);
  return <AddProductView categories={categories} attributes={attributes} />;
}
