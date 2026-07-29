import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import { dummyAdminCustomers } from "@/data/dummy/admin-customers";
import { dummyAdminOrders } from "@/data/dummy/admin-orders";
import {
  adminActivities,
  adminQuickActions,
  adminRecentOrders,
  adminStats,
  adminSummaryCards,
  revenueByMonth,
} from "@/data/dummy/admin-overview";
import { dummyCategories } from "@/data/dummy/categories";
import { dummyCollections } from "@/data/dummy/collections";
import { dummyOrders } from "@/data/dummy/orders";
import { dummyProductAttributes } from "@/data/dummy/product-attributes";
import { dummyProducts } from "@/data/dummy/products";
import { dummyReviews } from "@/data/dummy/reviews";
import { mapCategoriesToAdmin } from "@/types/admin-category";
import { DEFAULT_SITE_SETTINGS } from "@/lib/site-settings/defaults";

export type SeedResult = {
  collection: string;
  upserted: number;
};

async function upsertMany(
  collection: string,
  docs: Array<Record<string, unknown> & { legacyId: string }>,
): Promise<SeedResult> {
  if (docs.length === 0) {
    return { collection, upserted: 0 };
  }

  const Model = getSeedModel(collection);
  const ops = docs.map((doc) => ({
    updateOne: {
      filter: { legacyId: doc.legacyId },
      update: { $set: doc },
      upsert: true,
    },
  }));

  const result = await Model.bulkWrite(ops, { ordered: false });
  const upserted = (result.upsertedCount ?? 0) + (result.modifiedCount ?? 0);

  return { collection, upserted };
}

export async function seedDummyData(): Promise<SeedResult[]> {
  await dbConnect();

  const adminCategories = mapCategoriesToAdmin(dummyCategories);

  const categoryDocs = dummyCategories.map((category, index) => ({
    legacyId: category.id,
    ...category,
    name: category.title,
    description: adminCategories[index]?.description ?? "",
    sortOrder: index + 1,
  }));

  const productDocs = dummyProducts.map((product) => ({
    legacyId: product.id,
    id: product.id,
    title: product.title,
    slug: product.slug,
    brand_or_vendor: product.brand_or_vendor,
    category: product.category,
    category_id: product.category_id,
    category_slug: product.category_slug,
    description: product.description,
    tags: product.tags,
    pricing: product.pricing,
    inventory: product.inventory,
    attributes: product.attributes,
    ratings: product.ratings,
    images: product.images,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  }));

  const collectionDocs = dummyCollections.map((collection) => ({
    legacyId: collection.id,
    id: collection.id,
    title: collection.title,
    slug: collection.slug,
    description: collection.description,
    image: collection.image,
    productIds: collection.productIds,
  }));

  const customerDocs = dummyAdminCustomers.map((customer) => ({
    legacyId: customer.id,
    ...customer,
  }));

  const adminOrderDocs = dummyAdminOrders.map((order) => ({
    legacyId: order.id,
    ...order,
  }));

  const accountOrderDocs = dummyOrders.map((order) => ({
    legacyId: order.id,
    ...order,
  }));

  const attributeDocs = dummyProductAttributes.map((attribute) => ({
    legacyId: attribute.id,
    ...attribute,
  }));

  const reviewDocs = dummyReviews.map((review) => ({
    legacyId: review.id,
    ...review,
  }));

  const overviewDoc = {
    legacyId: "admin-overview",
    stats: adminStats,
    revenueByMonth,
    activities: adminActivities,
    quickActions: adminQuickActions,
    summaryCards: adminSummaryCards,
    recentOrders: adminRecentOrders,
  };

  const results: SeedResult[] = [];

  results.push(await upsertMany("categories", categoryDocs));
  results.push(await upsertMany("catalog_products", productDocs));
  results.push(await upsertMany("collections", collectionDocs));
  results.push(await upsertMany("customers", customerDocs));
  results.push(await upsertMany("admin_orders", adminOrderDocs));
  results.push(await upsertMany("account_orders", accountOrderDocs));
  results.push(await upsertMany("product_attributes", attributeDocs));
  results.push(await upsertMany("reviews", reviewDocs));
  results.push(await upsertMany("admin_overview", [overviewDoc]));
  results.push(
    await upsertMany("site_settings", [
      {
        legacyId: "global",
        ...DEFAULT_SITE_SETTINGS,
        logo: DEFAULT_SITE_SETTINGS.logoUrl
          ? { url: DEFAULT_SITE_SETTINGS.logoUrl }
          : undefined,
        favicon: DEFAULT_SITE_SETTINGS.faviconUrl
          ? { url: DEFAULT_SITE_SETTINGS.faviconUrl }
          : undefined,
      },
    ]),
  );

  return results;
}
