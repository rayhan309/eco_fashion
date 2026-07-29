import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
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
  return docs
    .map((doc) => mapCategoryDoc(doc as unknown as Record<string, unknown>))
    .filter((category) => Boolean(category.id && category.slug));
}

/** Categories from MongoDB only (seeded from dummy data). */
export async function getCategoriesFromDbOrFallback(): Promise<Category[]> {
  try {
    return await readCategoriesFromDb();
  } catch (error) {
    console.error("[db] categories read failed:", error);
    return [];
  }
}
