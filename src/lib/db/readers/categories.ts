import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import { dummyCategories } from "@/data/dummy/categories";
import type { Category } from "@/types/category";

function mapCategoryDoc(doc: Record<string, unknown>): Category {
  return {
    id: String(doc.legacyId ?? doc.id ?? ""),
    title: String(doc.title ?? doc.name ?? ""),
    slug: String(doc.slug ?? ""),
    image: String(doc.image ?? ""),
    rating: Number(doc.rating ?? 0),
  };
}

export async function readCategoriesFromDb(): Promise<Category[]> {
  await dbConnect();
  const Model = getSeedModel("categories");
  const docs = await Model.find({}).sort({ sortOrder: 1, title: 1 }).lean();
  return docs.map((doc) => mapCategoryDoc(doc as unknown as Record<string, unknown>));
}

export async function getCategoriesFromDbOrFallback(): Promise<Category[]> {
  try {
    const rows = await readCategoriesFromDb();
    if (rows.length > 0) return rows;
  } catch (error) {
    console.error("[db] categories read failed:", error);
  }
  return [...dummyCategories];
}
