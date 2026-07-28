import { getCategories } from "@/services/categories";
import { mapCategoriesToAdmin, type AdminCategory } from "@/types/admin-category";

export async function getAdminCategories(): Promise<AdminCategory[]> {
  const categories = await getCategories();
  return mapCategoriesToAdmin(categories);
}
