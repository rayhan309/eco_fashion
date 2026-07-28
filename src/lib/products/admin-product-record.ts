import mongoose from "mongoose";
import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import type { AddProductFormValues } from "@/lib/validations/product";
import { buildStoredProductFields } from "@/lib/products/build-product-payload";
import { variantsFormFromStored } from "@/lib/products/variant-utils";
import { ProductModel } from "@/models/Product";

export type AdminProductSource = "admin" | "catalog";

export type AdminProductRecord = {
  source: AdminProductSource;
  id: string;
  slug: string;
};

function isObjectId(value: string) {
  return mongoose.Types.ObjectId.isValid(value) && String(new mongoose.Types.ObjectId(value)) === value;
}

export async function findAdminProductRecord(id: string): Promise<AdminProductRecord | null> {
  await dbConnect();

  if (isObjectId(id)) {
    const doc = await ProductModel.findById(id).select("_id slug").lean();
    if (doc) {
      return { source: "admin", id: String(doc._id), slug: String(doc.slug) };
    }
  }

  const Catalog = getSeedModel("catalog_products");
  const catalogDoc = await Catalog.findOne({ legacyId: id }).select("legacyId slug").lean();
  if (catalogDoc) {
    const row = catalogDoc as unknown as Record<string, unknown>;
    return {
      source: "catalog",
      id: String(row.legacyId ?? id),
      slug: String(row.slug ?? ""),
    };
  }

  return null;
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : {};
}

function pricingFromForm(data: AddProductFormValues) {
  const regular = Number(String(data.regularPrice).replace(/,/g, ""));
  const sale = data.salePrice?.trim() ? Number(String(data.salePrice).replace(/,/g, "")) : null;
  const price = sale ?? regular;
  const compareAtPrice = sale ? regular : null;
  const discountPercent =
    compareAtPrice && compareAtPrice > 0 && sale
      ? Math.round((1 - sale / compareAtPrice) * 100)
      : 0;

  return { price, compareAtPrice, discountPercent, regular, sale };
}

export function catalogDocToFormValues(doc: Record<string, unknown>): AddProductFormValues {
  const pricing = record(doc.pricing);
  const price = Number(pricing.price ?? 0);
  const compareAt = pricing.compareAtPrice;
  const inventory = record(doc.inventory);

  return {
    titleEn: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    brandVendor: String(doc.brand_or_vendor ?? ""),
    description: String(doc.description ?? ""),
    productType: "regular",
    regularPrice: String(compareAt != null && compareAt !== "" ? compareAt : price),
    salePrice:
      compareAt != null && compareAt !== "" && Number(compareAt) > price ? String(price) : "",
    stockQuantity: String(inventory.quantity ?? 0),
    stockStatus:
      inventory.inStock === false || Number(inventory.quantity ?? 0) <= 0
        ? "out_of_stock"
        : "in_stock",
    categoryId: String(doc.category_id ?? ""),
    shippingClass: "standard",
    tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
    rating: String(record(doc.ratings).average ?? 0),
    reviews: String(record(doc.ratings).count ?? 0),
    mainImageUrl: Array.isArray(doc.images) && doc.images[0]
      ? String(record(doc.images[0]).url ?? "")
      : "",
    galleryUrls: Array.isArray(doc.images)
      ? doc.images
          .slice(1)
          .map((img) => String(record(img).url ?? ""))
          .filter(Boolean)
      : [],
    variants: [],
    variableAttributeId: "",
    variableOptionsText: "",
  };
}

export function adminDocToFormValues(doc: Record<string, unknown>): AddProductFormValues {
  const salePrice = doc.salePrice;
  const productType = doc.productType === "variable" ? "variable" : "regular";
  return {
    titleEn: String(doc.titleEn ?? ""),
    slug: String(doc.slug ?? ""),
    brandVendor: String(doc.brandVendor ?? ""),
    description: String(doc.description ?? ""),
    productType,
    regularPrice: String(doc.regularPrice ?? ""),
    salePrice: salePrice != null && salePrice !== "" ? String(salePrice) : "",
    stockQuantity: String(doc.stockQuantity ?? 0),
    stockStatus: (doc.stockStatus as AddProductFormValues["stockStatus"]) ?? "in_stock",
    variants: productType === "variable" ? variantsFormFromStored(doc.variants) : [],
    variableAttributeId: String(doc.variableAttributeId ?? ""),
    variableOptionsText: String(doc.variableOptionsText ?? ""),
    categoryId: String(doc.categoryId ?? ""),
    shippingClass: (doc.shippingClass as AddProductFormValues["shippingClass"]) ?? "standard",
    tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
    rating: String(doc.rating ?? 0),
    reviews: String(doc.reviews ?? 0),
    mainImageUrl: String(doc.mainImageUrl ?? ""),
    galleryUrls: Array.isArray(doc.galleryUrls) ? doc.galleryUrls.map(String) : [],
  };
}

export async function getAdminProductFormValues(id: string): Promise<AddProductFormValues | null> {
  await dbConnect();
  const found = await findAdminProductRecord(id);
  if (!found) return null;

  if (found.source === "admin") {
    const doc = await ProductModel.findById(found.id).lean();
    if (!doc) return null;
    return adminDocToFormValues(doc as unknown as Record<string, unknown>);
  }

  const Catalog = getSeedModel("catalog_products");
  const doc = await Catalog.findOne({ legacyId: found.id }).lean();
  if (!doc) return null;
  return catalogDocToFormValues(doc as unknown as Record<string, unknown>);
}

export async function isSlugTakenByOther(
  slug: string,
  owner: AdminProductRecord,
): Promise<boolean> {
  await dbConnect();

  const adminHit = await ProductModel.findOne({ slug }).select("_id").lean();
  if (adminHit) {
    const adminId = String(adminHit._id);
    if (!(owner.source === "admin" && owner.id === adminId)) return true;
  }

  const Catalog = getSeedModel("catalog_products");
  const catalogHit = await Catalog.findOne({ slug }).select("legacyId").lean();
  if (catalogHit) {
    const legacyId = String((catalogHit as unknown as Record<string, unknown>).legacyId ?? "");
    if (!(owner.source === "catalog" && owner.id === legacyId)) return true;
  }

  return false;
}

export function buildCatalogUpdateFromForm(
  data: AddProductFormValues,
  category: { id: string; slug: string; title: string },
) {
  const { price, compareAtPrice, discountPercent } = pricingFromForm(data);
  const qty = data.stockQuantity?.trim() ? Number(data.stockQuantity) : 0;
  const inStock = data.stockStatus === "in_stock" && qty > 0;

  const images: { url: string; alt: string }[] = [];
  if (data.mainImageUrl?.trim()) {
    images.push({ url: data.mainImageUrl.trim(), alt: data.titleEn.trim() });
  }
  for (const url of data.galleryUrls ?? []) {
    if (url && url !== data.mainImageUrl) images.push({ url, alt: data.titleEn.trim() });
  }

  return {
    title: data.titleEn.trim(),
    slug: data.slug.trim(),
    brand_or_vendor: data.brandVendor?.trim() ?? "",
    category: category.title,
    category_id: category.id,
    category_slug: category.slug,
    description: data.description?.trim() ?? "",
    tags: data.tags,
    pricing: {
      price,
      compareAtPrice,
      currency: "BDT" as const,
      discountPercent,
    },
    inventory: {
      sku: `EF-${data.slug.slice(0, 8).toUpperCase()}`,
      quantity: qty,
      inStock,
    },
    ratings: {
      average: data.rating?.trim() ? Number(data.rating) : 0,
      count: data.reviews?.trim() ? Number(data.reviews) : 0,
    },
    images,
  };
}

export async function updateAdminProductRecord(
  id: string,
  data: AddProductFormValues,
  category: { id: string; slug: string; title: string },
  slug: string,
): Promise<AdminProductRecord> {
  await dbConnect();
  const found = await findAdminProductRecord(id);
  if (!found) throw new Error("Product not found");

  if (found.source === "admin") {
    const stored = buildStoredProductFields(data);

    await ProductModel.findByIdAndUpdate(found.id, {
      titleEn: data.titleEn.trim(),
      slug,
      brandVendor: data.brandVendor?.trim() ?? "",
      description: data.description?.trim() ?? "",
      productType: stored.productType,
      regularPrice: stored.regularPrice,
      salePrice: stored.salePrice,
      discountPercent: stored.discountPercent,
      stockQuantity: stored.stockQuantity,
      stockStatus: stored.stockStatus,
      variants: stored.variants,
      variableAttributeId: data.variableAttributeId?.trim() ?? "",
      variableOptionsText: data.variableOptionsText?.trim() ?? "",
      categoryId: category.id,
      categorySlug: category.slug,
      categoryTitle: category.title,
      shippingClass: data.shippingClass,
      tags: data.tags,
      rating: data.rating?.trim() ? Number(data.rating) : 0,
      reviews: data.reviews?.trim() ? Number(data.reviews) : 0,
      mainImageUrl: data.mainImageUrl?.trim() ?? "",
      galleryUrls: data.galleryUrls ?? [],
    });

    return { ...found, slug };
  }

  const Catalog = getSeedModel("catalog_products");
  const payload = buildCatalogUpdateFromForm(data, category);
  await Catalog.updateOne({ legacyId: found.id }, { $set: payload });
  return { ...found, slug };
}

export async function deleteAdminProductRecord(id: string): Promise<void> {
  await dbConnect();
  const found = await findAdminProductRecord(id);
  if (!found) throw new Error("Product not found");

  if (found.source === "admin") {
    await ProductModel.findByIdAndDelete(found.id);
    return;
  }

  const Catalog = getSeedModel("catalog_products");
  await Catalog.deleteOne({ legacyId: found.id });
}
