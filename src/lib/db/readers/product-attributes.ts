import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import {
  dummyProductAttributes,
  type ProductAttribute,
} from "@/data/dummy/product-attributes";

function mapAttributeDoc(doc: Record<string, unknown>): ProductAttribute {
  return {
    id: String(doc.legacyId ?? doc.id ?? ""),
    name: String(doc.name ?? ""),
    nameBn: String(doc.nameBn ?? ""),
    slug: String(doc.slug ?? ""),
    placeholder: String(doc.placeholder ?? ""),
  };
}

export async function readProductAttributesFromDb(): Promise<ProductAttribute[]> {
  await dbConnect();
  const Model = getSeedModel("product_attributes");
  const docs = await Model.find({}).sort({ name: 1 }).lean();
  return docs.map((doc) => mapAttributeDoc(doc as unknown as Record<string, unknown>));
}

export async function getProductAttributesFromDbOrFallback(): Promise<ProductAttribute[]> {
  try {
    return await readProductAttributesFromDb();
  } catch (error) {
    console.error("[db] product_attributes read failed:", error);
  }
  return [...dummyProductAttributes];
}
