import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import {
  slugifyCategoryName,
  type AdminCategoryFormValues,
} from "@/lib/validations/admin-category";
import type { AdminCategory } from "@/types/admin-category";

function mapAdminCategoryDoc(doc: Record<string, unknown>, fallbackOrder = 0): AdminCategory {
  return {
    id: String(doc.legacyId ?? doc.id ?? ""),
    name: String(doc.name ?? doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    image: String(doc.image ?? ""),
    description: String(doc.description ?? ""),
    sortOrder: Number(doc.sortOrder ?? fallbackOrder),
  };
}

export async function readAdminCategoriesFromDb(): Promise<AdminCategory[]> {
  await dbConnect();
  const Model = getSeedModel("categories");
  const docs = await Model.find({}).sort({ sortOrder: 1, title: 1, name: 1 }).lean();
  return docs
    .map((doc, index) =>
      mapAdminCategoryDoc(doc as unknown as Record<string, unknown>, index + 1),
    )
    .filter((category) => Boolean(category.id && category.slug))
    .map((category, index) => ({
      ...category,
      sortOrder: category.sortOrder > 0 ? category.sortOrder : index + 1,
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export async function findAdminCategoryById(id: string): Promise<AdminCategory | null> {
  await dbConnect();
  const Model = getSeedModel("categories");
  const doc = await Model.findOne({ legacyId: id }).lean();
  if (!doc) return null;
  return mapAdminCategoryDoc(doc as unknown as Record<string, unknown>);
}

async function isSlugTaken(slug: string, exceptLegacyId?: string): Promise<boolean> {
  const Model = getSeedModel("categories");
  const doc = await Model.findOne({ slug }).select("legacyId").lean();
  if (!doc) return false;
  const legacyId = String((doc as unknown as Record<string, unknown>).legacyId ?? "");
  if (exceptLegacyId && legacyId === exceptLegacyId) return false;
  return true;
}

async function nextSortOrder(): Promise<number> {
  const Model = getSeedModel("categories");
  const last = await Model.findOne({})
    .sort({ sortOrder: -1 })
    .select("sortOrder")
    .lean();
  if (!last) return 1;
  const current = Number((last as unknown as Record<string, unknown>).sortOrder ?? 0);
  return (Number.isFinite(current) ? current : 0) + 1;
}

export async function createCategoryInDb(
  data: AdminCategoryFormValues,
): Promise<AdminCategory> {
  await dbConnect();
  const Model = getSeedModel("categories");

  const slug = (data.slug.trim() || slugifyCategoryName(data.name)).toLowerCase();
  if (await isSlugTaken(slug)) {
    throw new Error("Slug is already in use");
  }

  const legacyId = `cat-${slug}`;
  if (await Model.exists({ legacyId })) {
    throw new Error("A category with this slug already exists");
  }

  const sortOrder = await nextSortOrder();
  const name = data.name.trim();

  await Model.create({
    legacyId,
    title: name,
    name,
    slug,
    image: data.image.trim(),
    description: data.description?.trim() ?? "",
    sortOrder,
    rating: 0,
  } as Record<string, unknown>);

  const created = await findAdminCategoryById(legacyId);
  if (!created) throw new Error("Failed to create category");
  return created;
}

export async function updateCategoryInDb(
  id: string,
  data: AdminCategoryFormValues,
): Promise<AdminCategory> {
  await dbConnect();
  const Model = getSeedModel("categories");
  const existing = await Model.findOne({ legacyId: id }).lean();
  if (!existing) throw new Error("Category not found");

  const slug = data.slug.trim().toLowerCase();
  if (await isSlugTaken(slug, id)) {
    throw new Error("Slug is already in use");
  }

  const name = data.name.trim();
  await Model.updateOne(
    { legacyId: id },
    {
      $set: {
        title: name,
        name,
        slug,
        image: data.image.trim(),
        description: data.description?.trim() ?? "",
      },
    },
  );

  const updated = await findAdminCategoryById(id);
  if (!updated) throw new Error("Category not found");
  return updated;
}

export async function deleteCategoryInDb(id: string): Promise<void> {
  await dbConnect();
  const Model = getSeedModel("categories");
  const result = await Model.deleteOne({ legacyId: id });
  if (result.deletedCount === 0) throw new Error("Category not found");
}

export async function reorderCategoriesInDb(orderedIds: string[]): Promise<AdminCategory[]> {
  await dbConnect();
  const Model = getSeedModel("categories");

  await Promise.all(
    orderedIds.map((legacyId, index) =>
      Model.updateOne({ legacyId }, { $set: { sortOrder: index + 1 } }),
    ),
  );

  return readAdminCategoriesFromDb();
}
