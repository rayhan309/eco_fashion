import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import type { Collection } from "@/types/collection";

function mapCollectionDoc(doc: Record<string, unknown>): Collection {
  const productIds = doc.productIds;
  return {
    id: String(doc.legacyId ?? doc.id ?? ""),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    description: String(doc.description ?? ""),
    image: String(doc.image ?? ""),
    productIds: Array.isArray(productIds) ? productIds.map(String) : [],
  };
}

export async function readCollectionsFromDb(): Promise<Collection[]> {
  await dbConnect();
  const Model = getSeedModel("collections");
  const docs = await Model.find({}).sort({ title: 1 }).lean();
  return docs
    .map((doc) => mapCollectionDoc(doc as unknown as Record<string, unknown>))
    .filter((collection) => Boolean(collection.id && collection.slug));
}

/** Collections from MongoDB only (seeded from dummy data). */
export async function getCollectionsFromDbOrFallback(): Promise<Collection[]> {
  try {
    return await readCollectionsFromDb();
  } catch (error) {
    console.error("[db] collections read failed:", error);
    return [];
  }
}
