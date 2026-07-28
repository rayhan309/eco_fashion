import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import type { ProductAttribute } from "@/data/dummy/product-attributes";
import type { ProductAttributeFormValues } from "@/lib/validations/product-attribute";
import { slugifyAttributeName } from "@/lib/validations/product-attribute";

function mapAttributeDoc(doc: Record<string, unknown>): ProductAttribute {
  return {
    id: String(doc.legacyId ?? doc.id ?? ""),
    name: String(doc.name ?? ""),
    nameBn: String(doc.nameBn ?? ""),
    slug: String(doc.slug ?? ""),
    placeholder: String(doc.placeholder ?? ""),
  };
}

export async function findProductAttributeById(id: string): Promise<ProductAttribute | null> {
  await dbConnect();
  const Model = getSeedModel("product_attributes");
  const doc = await Model.findOne({ legacyId: id }).lean();
  if (!doc) return null;
  return mapAttributeDoc(doc as unknown as Record<string, unknown>);
}

async function isSlugTaken(slug: string, exceptLegacyId?: string): Promise<boolean> {
  const Model = getSeedModel("product_attributes");
  const doc = await Model.findOne({ slug }).select("legacyId").lean();
  if (!doc) return false;
  const legacyId = String((doc as unknown as Record<string, unknown>).legacyId ?? "");
  if (exceptLegacyId && legacyId === exceptLegacyId) return false;
  return true;
}

export async function createProductAttributeInDb(
  data: ProductAttributeFormValues,
): Promise<ProductAttribute> {
  await dbConnect();
  const Model = getSeedModel("product_attributes");

  const slug = (data.slug.trim() || slugifyAttributeName(data.name)).toLowerCase();
  if (await isSlugTaken(slug)) {
    throw new Error("Slug is already in use");
  }

  const legacyId = `attr-${slug}`;
  const existsId = await Model.exists({ legacyId });
  if (existsId) {
    throw new Error("An attribute with this slug already exists");
  }

  await Model.create({
    legacyId,
    name: data.name.trim(),
    nameBn: data.nameBn.trim(),
    slug,
    placeholder: data.placeholder.trim(),
  } as Record<string, unknown>);

  const created = await findProductAttributeById(legacyId);
  if (!created) throw new Error("Failed to create attribute");
  return created;
}

export async function updateProductAttributeInDb(
  id: string,
  data: ProductAttributeFormValues,
): Promise<ProductAttribute> {
  await dbConnect();
  const Model = getSeedModel("product_attributes");
  const existing = await Model.findOne({ legacyId: id }).lean();
  if (!existing) throw new Error("Attribute not found");

  const slug = data.slug.trim().toLowerCase();
  if (await isSlugTaken(slug, id)) {
    throw new Error("Slug is already in use");
  }

  await Model.updateOne(
    { legacyId: id },
    {
      $set: {
        name: data.name.trim(),
        nameBn: data.nameBn.trim(),
        slug,
        placeholder: data.placeholder.trim(),
      },
    },
  );

  const updated = await findProductAttributeById(id);
  if (!updated) throw new Error("Attribute not found");
  return updated;
}

export async function deleteProductAttributeInDb(id: string): Promise<void> {
  await dbConnect();
  const Model = getSeedModel("product_attributes");
  const result = await Model.deleteOne({ legacyId: id });
  if (result.deletedCount === 0) throw new Error("Attribute not found");
}
