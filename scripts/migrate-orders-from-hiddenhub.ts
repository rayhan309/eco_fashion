import { MongoClient, type Document } from "mongodb";
import { config } from "dotenv";

config();

const TARGET_URI = process.env.MONGODB_URI ?? process.env.TARGET_MONGODB_URI;
const TARGET_DB = process.env.DBNAME || process.env.BDNAME || "eco_fashion";
const SOURCE_URI = process.env.SOURCE_MONGODB_URI ?? TARGET_URI;
const SOURCE_DB = process.env.SOURCE_ORDERS_DB ?? "hidden_urban_bd";

type LegacyOrder = Document;

function mapStatus(value: unknown): string {
  const status = String(value ?? "new_order");
  const map: Record<string, string> = {
    new_order: "new_order",
    order_confirmed: "order_confirmed",
    steadfast_entered: "entered_steadfast",
    entered_steadfast: "entered_steadfast",
    no_response: "no_response",
    will_inform_later: "will_inform_later",
    follow_up_needed: "follow_up_needed",
    out_for_delivery: "out_for_delivery",
    scammer: "scammer_fraudulent",
    scammer_fraudulent: "scammer_fraudulent",
    delivered: "delivered",
    cancelled: "cancelled",
  };
  return map[status] ?? "new_order";
}

/** Map legacy hiddenhub_bd shape or pass through current storefront order docs. */
function mapOrderDoc(doc: LegacyOrder) {
  if (doc.orderNumber && doc.customer && Array.isArray(doc.items)) {
    const customer = (doc.customer ?? {}) as Record<string, unknown>;
    const items = doc.items.map((row) => {
      const item = (row ?? {}) as Record<string, unknown>;
      return {
        productId: String(item.productId ?? item.product_id ?? ""),
        slug: String(item.slug ?? ""),
        name: String(item.name ?? item.title_en ?? item.title ?? "Product"),
        price: Number(item.price ?? item.line_total ?? 0),
        currency: "BDT",
        quantity: Number(item.quantity ?? 1),
        size: String(item.size ?? "M"),
        color: String(item.color ?? "Default"),
        image: String(item.image ?? ""),
      };
    });

    const itemCount = Number(
      doc.itemCount ?? items.reduce((sum, item) => sum + item.quantity, 0),
    );

    return {
      legacyId: String(doc.legacyId ?? doc.id ?? doc._id ?? `ord-${Date.now()}`),
      orderNumber: String(doc.orderNumber ?? doc.order_number ?? ""),
      status: mapStatus(doc.status),
      customer: {
        name: String(customer.name ?? ""),
        phone: String(customer.phone ?? ""),
        email: String(customer.email ?? ""),
        address: String(customer.address ?? ""),
        region: String(customer.region ?? ""),
        city: String(customer.city ?? ""),
        note: String(customer.note ?? ""),
        deliveryArea: String(customer.deliveryArea ?? customer.delivery_area ?? ""),
      },
      items,
      itemCount,
      itemsSummary: String(
        doc.itemsSummary ??
          items
            .map((item) => item.name)
            .slice(0, 3)
            .join(", "),
      ),
      subtotal: Number(doc.subtotal ?? doc.pricing?.subtotal ?? 0),
      shippingFee: Number(
        doc.shippingFee ?? doc.pricing?.delivery_charge ?? doc.delivery?.charge ?? 0,
      ),
      total: Number(doc.total ?? doc.pricing?.total ?? 0),
      currency: "BDT",
      paymentMethod: "cod",
      createdAt: String(doc.createdAt ?? new Date().toISOString()),
      updatedAt: String(doc.updatedAt ?? doc.createdAt ?? new Date().toISOString()),
    };
  }

  const customer = (doc.customer ?? {}) as Record<string, unknown>;
  const delivery = (doc.delivery ?? {}) as Record<string, unknown>;
  const pricing = (doc.pricing ?? {}) as Record<string, unknown>;
  const items = Array.isArray(doc.items) ? doc.items : [];

  const mappedItems = items.map((row) => {
    const item = (row ?? {}) as Record<string, unknown>;
    return {
      productId: String(item.product_id ?? item.productId ?? ""),
      slug: String(item.slug ?? ""),
      name: String(item.title_en ?? item.title ?? item.name ?? "Product"),
      price: Number(item.price ?? item.line_total ?? 0),
      currency: "BDT",
      quantity: Number(item.quantity ?? 1),
      size: "M",
      color: "Default",
      image: String(item.image ?? ""),
    };
  });

  const itemCount = mappedItems.reduce((sum, item) => sum + item.quantity, 0);

  return {
    legacyId: String(doc.legacyId ?? doc.id ?? doc._id ?? `ord-${Date.now()}`),
    orderNumber: String(doc.orderNumber ?? doc.order_number ?? doc.legacyId ?? ""),
    status: mapStatus(doc.status),
    customer: {
      name: String(customer.name ?? ""),
      phone: String(customer.phone ?? ""),
      email: String(customer.email ?? ""),
      address: String(customer.address ?? ""),
      region: String(customer.region ?? ""),
      city: String(customer.city ?? ""),
      note: String(customer.note ?? ""),
      deliveryArea: String(
        customer.delivery_area ?? delivery.area ?? delivery.label ?? "",
      ),
    },
    items: mappedItems,
    itemCount,
    itemsSummary: mappedItems
      .map((item) => item.name)
      .slice(0, 3)
      .join(", "),
    subtotal: Number(pricing.subtotal ?? doc.subtotal ?? 0),
    shippingFee: Number(pricing.delivery_charge ?? delivery.charge ?? doc.shippingFee ?? 0),
    total: Number(pricing.total ?? doc.total ?? 0),
    currency: "BDT",
    paymentMethod: "cod",
    createdAt: String(doc.createdAt ?? new Date().toISOString()),
    updatedAt: String(doc.updatedAt ?? doc.createdAt ?? new Date().toISOString()),
  };
}

async function migrateOrders() {
  if (!SOURCE_URI) {
    throw new Error("SOURCE_MONGODB_URI or MONGODB_URI is required");
  }
  if (!TARGET_URI) {
    throw new Error("MONGODB_URI or TARGET_MONGODB_URI is required");
  }

  const sourceClient = new MongoClient(SOURCE_URI);
  const targetClient = new MongoClient(TARGET_URI);

  await sourceClient.connect();
  await targetClient.connect();

  const sourceOrders = sourceClient.db(SOURCE_DB).collection("orders");
  const targetOrders = targetClient.db(TARGET_DB).collection("orders");

  const legacyDocs = await sourceOrders.find({}).sort({ createdAt: -1 }).toArray();
  const mapped = legacyDocs.map(mapOrderDoc).filter((order) => Boolean(order.orderNumber));

  await targetOrders.deleteMany({});
  if (mapped.length > 0) {
    await targetOrders.insertMany(mapped, { ordered: false });
  }

  await sourceClient.close();
  await targetClient.close();

  console.log(
    `[migrate-orders] Copied ${mapped.length} order(s) from "${SOURCE_DB}.orders" to "${TARGET_DB}.orders".`,
  );
}

migrateOrders().catch((error) => {
  console.error("[migrate-orders] Failed:", error);
  process.exit(1);
});
