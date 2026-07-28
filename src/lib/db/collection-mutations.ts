import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import type { Collection } from "@/types/collection";
import type { CollectionFormValues } from "@/lib/validations/collection";
import { slugifyCollectionTitle } from "@/lib/validations/collection";

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

export async function findCollectionById(id: string): Promise<Collection | null> {
  await dbConnect();
  const Model = getSeedModel("collections");
  const doc = await Model.findOne({ legacyId: id }).lean();
  if (!doc) return null;
  return mapCollectionDoc(doc as unknown as Record<string, unknown>);
}

async function isSlugTaken(slug: string, exceptLegacyId?: string): Promise<boolean> {
  const Model = getSeedModel("collections");
  const doc = await Model.findOne({ slug }).select("legacyId").lean();
  if (!doc) return false;
  const legacyId = String((doc as unknown as Record<string, unknown>).legacyId ?? "");
  if (exceptLegacyId && legacyId === exceptLegacyId) return false;
  return true;
}

export async function createCollectionInDb(data: CollectionFormValues): Promise<Collection> {
  await dbConnect();
  const Model = getSeedModel("collections");

  const slug = (data.slug.trim() || slugifyCollectionTitle(data.title)).toLowerCase();
  if (await isSlugTaken(slug)) {
    throw new Error("Slug is already in use");
  }

  const legacyId = `col-${slug}`;
  if (await Model.exists({ legacyId })) {
    throw new Error("A collection with this slug already exists");
  }

  await Model.create({
    legacyId,
    title: data.title.trim(),
    slug,
    description: data.description.trim(),
    image: data.image?.trim() ?? "",
    productIds: data.productIds,
  } as Record<string, unknown>);

  const created = await findCollectionById(legacyId);
  if (!created) throw new Error("Failed to create collection");
  return created;
}

export async function updateCollectionInDb(
  id: string,
  data: CollectionFormValues,
): Promise<Collection> {
  await dbConnect();
  const Model = getSeedModel("collections");
  const existing = await Model.findOne({ legacyId: id }).lean();
  if (!existing) throw new Error("Collection not found");

  const slug = data.slug.trim().toLowerCase();
  if (await isSlugTaken(slug, id)) {
    throw new Error("Slug is already in use");
  }

  await Model.updateOne(
    { legacyId: id },
    {
      $set: {
        title: data.title.trim(),
        slug,
        description: data.description.trim(),
        image: data.image?.trim() ?? "",
        productIds: data.productIds,
      },
    },
  );

  const updated = await findCollectionById(id);
  if (!updated) throw new Error("Collection not found");
  return updated;
}

export async function deleteCollectionInDb(id: string): Promise<void> {
  await dbConnect();
  const Model = getSeedModel("collections");
  const result = await Model.deleteOne({ legacyId: id });
  if (result.deletedCount === 0) throw new Error("Collection not found");
}

export function collectionToFormValues(collection: Collection): CollectionFormValues {
  return {
    title: collection.title,
    slug: collection.slug,
    description: collection.description,
    image: collection.image,
    productIds: collection.productIds,
  };
}
