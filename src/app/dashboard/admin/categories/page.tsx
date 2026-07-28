import type { Metadata } from "next";
import { AdminCategoriesView } from "@/components/admin";
import { getAdminCategories } from "@/services/admin-categories";

export const metadata: Metadata = {
  title: "Categories",
};

export default async function AdminCategoriesPage() {
  const initialCategories = await getAdminCategories();
  return <AdminCategoriesView initialCategories={initialCategories} />;
}
