import { readAdminCategoriesFromDb } from "@/lib/db/category-mutations";
import type { AdminCategory } from "@/types/admin-category";

export async function getAdminCategories(): Promise<AdminCategory[]> {
  try {
    return await readAdminCategoriesFromDb();
  } catch (error) {
    console.error("[db] admin categories read failed:", error);
    return [];
  }
}
