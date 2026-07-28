import type { Metadata } from "next";
import { AdminProductsView } from "@/components/admin";
import { getAdminProductsCatalog } from "@/services/admin-products";

export const metadata: Metadata = {
  title: "Products",
};

export default async function AdminProductsPage() {
  const { products, categories } = await getAdminProductsCatalog();
  return <AdminProductsView products={products} categories={categories} />;
}
