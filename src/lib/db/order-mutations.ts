import { dbConnect } from "@/lib/dbConnect";
import { getSiteSettingsFromDbOrFallback } from "@/lib/db/readers/site-settings";
import { getSeedModel } from "@/lib/seed/seed-model";
import {
  findShippingAreaIndex,
  resolveShippingFee,
} from "@/lib/shipping/calculate";
import type { AdminOrder, AdminOrderStatus } from "@/types/admin-order";
import { ADMIN_ORDER_STATUSES } from "@/types/admin-order";
import type { CreateStoreOrderInput, StoreOrder } from "@/types/store-order";

function itemsSummary(items: CreateStoreOrderInput["items"]): string {
  return items.map((item) => item.name).slice(0, 3).join(", ");
}

function itemCount(items: CreateStoreOrderInput["items"]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

function nextOrderNumber(): string {
  const stamp = Date.now().toString().slice(-6);
  const rand = Math.floor(Math.random() * 90 + 10);
  return `HU-${stamp}${rand}`;
}

export function mapStoreOrderDoc(doc: Record<string, unknown>): StoreOrder {
  const status = String(doc.status ?? "new_order");
  const customer = (doc.customer ?? {}) as Record<string, unknown>;
  const items = Array.isArray(doc.items) ? doc.items : [];

  return {
    id: String(doc.legacyId ?? doc.id ?? ""),
    orderNumber: String(doc.orderNumber ?? ""),
    status: ADMIN_ORDER_STATUSES.includes(status as AdminOrderStatus)
      ? (status as AdminOrderStatus)
      : "new_order",
    customer: {
      name: String(customer.name ?? ""),
      phone: String(customer.phone ?? ""),
      email: String(customer.email ?? ""),
      address: String(customer.address ?? ""),
      region: String(customer.region ?? ""),
      city: String(customer.city ?? ""),
      note: String(customer.note ?? ""),
      deliveryArea: String(customer.deliveryArea ?? ""),
    },
    items: items.map((row) => {
      const item = (row ?? {}) as Record<string, unknown>;
      return {
        productId: String(item.productId ?? ""),
        slug: String(item.slug ?? ""),
        name: String(item.name ?? ""),
        price: Number(item.price ?? 0),
        currency: item.currency === "USD" ? "USD" : "BDT",
        quantity: Number(item.quantity ?? 1),
        size: (String(item.size ?? "M") as StoreOrder["items"][number]["size"]),
        color: String(item.color ?? "Default"),
        image: String(item.image ?? ""),
      };
    }),
    itemCount: Number(doc.itemCount ?? 0),
    itemsSummary: String(doc.itemsSummary ?? ""),
    subtotal: Number(doc.subtotal ?? 0),
    shippingFee: Number(doc.shippingFee ?? 0),
    total: Number(doc.total ?? 0),
    currency: "BDT",
    paymentMethod: "cod",
    createdAt: String(doc.createdAt ?? new Date().toISOString()),
    updatedAt: String(doc.updatedAt ?? new Date().toISOString()),
  };
}

export function toAdminOrder(order: StoreOrder): AdminOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customer.name,
    customerPhone: order.customer.phone,
    itemsSummary: order.itemsSummary,
    itemCount: order.itemCount,
    total: order.total,
    currency: "BDT",
    status: order.status,
    createdAt: order.createdAt,
  };
}

export async function createStoreOrderInDb(
  input: CreateStoreOrderInput,
): Promise<StoreOrder> {
  if (!input.items.length) {
    throw new Error("Cart is empty");
  }
  if (!input.customer.name.trim() || !input.customer.phone.trim()) {
    throw new Error("Name and phone are required");
  }
  if (!input.customer.address.trim() || !input.customer.city.trim()) {
    throw new Error("Delivery address is required");
  }

  await dbConnect();
  const settings = await getSiteSettingsFromDbOrFallback();
  const areaIndex = findShippingAreaIndex(
    settings,
    input.deliveryAreaId || input.customer.deliveryArea || "",
  );
  const selectedArea = settings.shippingAreas[areaIndex];

  const Model = getSeedModel("orders");
  const now = new Date().toISOString();
  const legacyId = `ord-${Date.now()}`;
  const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingFee = resolveShippingFee(settings, areaIndex, subtotal);
  const total = subtotal + shippingFee;
  const count = itemCount(input.items);
  const summary = itemsSummary(input.items);

  const payload = {
    legacyId,
    orderNumber: nextOrderNumber(),
    status: "new_order" as const,
    customer: {
      name: input.customer.name.trim(),
      phone: input.customer.phone.trim(),
      email: input.customer.email.trim(),
      address: input.customer.address.trim(),
      region: input.customer.region.trim(),
      city: input.customer.city.trim(),
      note: input.customer.note.trim(),
      deliveryArea: (
        input.customer.deliveryArea ||
        selectedArea?.name ||
        ""
      ).trim(),
    },
    items: input.items,
    itemCount: count,
    itemsSummary: summary,
    subtotal,
    shippingFee,
    total,
    currency: "BDT" as const,
    paymentMethod: "cod" as const,
    createdAt: now,
    updatedAt: now,
  };

  await Model.create(payload as Record<string, unknown>);

  // Keep customer rollup fresh for admin customers list.
  const Customers = getSeedModel("customers");
  const existing = await Customers.findOne({ phone: payload.customer.phone }).lean();
  if (existing) {
    const doc = existing as unknown as Record<string, unknown>;
    await Customers.updateOne(
      { phone: payload.customer.phone },
      {
        $set: {
          name: payload.customer.name,
          address: `${payload.customer.address}, ${payload.customer.city}`,
          lastOrderAt: now,
          orderCount: Number(doc.orderCount ?? 0) + 1,
          totalSpent: Number(doc.totalSpent ?? 0) + total,
        },
      },
    );
  } else {
    await Customers.updateOne(
      { phone: payload.customer.phone },
      {
        $set: {
          legacyId: `cus-${Date.now()}`,
          name: payload.customer.name,
          phone: payload.customer.phone,
          address: `${payload.customer.address}, ${payload.customer.city}`,
          orderCount: 1,
          totalSpent: total,
          lastOrderAt: now,
        },
      },
      { upsert: true },
    );
  }

  return mapStoreOrderDoc(payload);
}

export async function readStoreOrdersFromDb(): Promise<StoreOrder[]> {
  await dbConnect();
  const Model = getSeedModel("orders");
  const docs = await Model.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((doc) => mapStoreOrderDoc(doc as unknown as Record<string, unknown>));
}

export async function getStoreOrderByNumber(
  orderNumber: string,
): Promise<StoreOrder | null> {
  const normalized = orderNumber.trim().toUpperCase();
  if (!normalized) return null;

  await dbConnect();
  const Model = getSeedModel("orders");
  const doc = await Model.findOne({
    orderNumber: { $regex: new RegExp(`^${normalized.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
  }).lean();

  if (!doc) return null;
  return mapStoreOrderDoc(doc as unknown as Record<string, unknown>);
}

export async function getStoreOrderByNumberAndPhone(
  orderNumber: string,
  phone: string,
): Promise<StoreOrder | null> {
  const order = await getStoreOrderByNumber(orderNumber);
  if (!order) return null;

  const normalizePhone = (value: string) => value.replace(/\D/g, "").replace(/^880/, "0");
  if (normalizePhone(order.customer.phone) !== normalizePhone(phone)) {
    return null;
  }
  return order;
}

function mapLegacyAdminOrderToStoreOrder(doc: Record<string, unknown>): StoreOrder {
  const status = String(doc.status ?? "new_order");
  const createdAt = String(doc.createdAt ?? new Date().toISOString());
  const total = Number(doc.total ?? 0);
  return {
    id: String(doc.legacyId ?? doc.id ?? ""),
    orderNumber: String(doc.orderNumber ?? ""),
    status: ADMIN_ORDER_STATUSES.includes(status as AdminOrderStatus)
      ? (status as AdminOrderStatus)
      : "new_order",
    customer: {
      name: String(doc.customerName ?? ""),
      phone: String(doc.customerPhone ?? ""),
      email: String(doc.customerEmail ?? ""),
      address: String(doc.customerAddress ?? ""),
      region: String(doc.customerRegion ?? ""),
      city: String(doc.customerCity ?? ""),
      note: String(doc.note ?? doc.customerNote ?? ""),
      deliveryArea: String(doc.deliveryArea ?? ""),
    },
    items: [],
    itemCount: Number(doc.itemCount ?? 0),
    itemsSummary: String(doc.itemsSummary ?? ""),
    subtotal: Number(doc.subtotal ?? total),
    shippingFee: Number(doc.shippingFee ?? 0),
    total,
    currency: "BDT",
    paymentMethod: "cod",
    createdAt,
    updatedAt: String(doc.updatedAt ?? createdAt),
  };
}

export type UpdateAdminOrderInput = {
  status: AdminOrderStatus;
  customer: {
    name: string;
    phone: string;
    email: string;
    address: string;
    region: string;
    city: string;
    note: string;
    deliveryArea?: string;
  };
};

export async function getAdminOrderById(id: string): Promise<StoreOrder | null> {
  const normalized = id.trim();
  if (!normalized) return null;

  await dbConnect();

  const Orders = getSeedModel("orders");
  const storeDoc = await Orders.findOne({ legacyId: normalized }).lean();
  if (storeDoc) {
    return mapStoreOrderDoc(storeDoc as unknown as Record<string, unknown>);
  }

  const Legacy = getSeedModel("admin_orders");
  const legacyDoc = await Legacy.findOne({ legacyId: normalized }).lean();
  if (legacyDoc) {
    return mapLegacyAdminOrderToStoreOrder(legacyDoc as unknown as Record<string, unknown>);
  }

  return null;
}

export async function updateAdminOrderInDb(
  id: string,
  input: UpdateAdminOrderInput,
): Promise<StoreOrder> {
  const normalized = id.trim();
  if (!normalized) throw new Error("Order not found");

  await dbConnect();
  const now = new Date().toISOString();
  const existing = await getAdminOrderById(normalized);
  const customer = {
    name: input.customer.name.trim(),
    phone: input.customer.phone.trim(),
    email: input.customer.email.trim(),
    address: input.customer.address.trim(),
    region: input.customer.region.trim(),
    city: input.customer.city.trim(),
    note: input.customer.note.trim(),
    deliveryArea: (
      input.customer.deliveryArea ??
      existing?.customer.deliveryArea ??
      ""
    ).trim(),
  };

  if (!customer.name || !customer.phone) {
    throw new Error("Name and phone are required");
  }

  const Orders = getSeedModel("orders");
  const storeUpdated = await Orders.findOneAndUpdate(
    { legacyId: normalized },
    {
      $set: {
        status: input.status,
        customer,
        updatedAt: now,
      },
    },
    { new: true },
  ).lean();

  if (storeUpdated) {
    return mapStoreOrderDoc(storeUpdated as unknown as Record<string, unknown>);
  }

  const Legacy = getSeedModel("admin_orders");
  const legacyUpdated = await Legacy.findOneAndUpdate(
    { legacyId: normalized },
    {
      $set: {
        status: input.status,
        customerName: customer.name,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        customerAddress: customer.address,
        customerRegion: customer.region,
        customerCity: customer.city,
        note: customer.note,
        updatedAt: now,
      },
    },
    { new: true },
  ).lean();

  if (legacyUpdated) {
    return mapLegacyAdminOrderToStoreOrder(
      legacyUpdated as unknown as Record<string, unknown>,
    );
  }

  throw new Error("Order not found");
}

export async function deleteAdminOrderInDb(id: string): Promise<void> {
  const normalized = id.trim();
  if (!normalized) throw new Error("Order not found");

  await dbConnect();

  const Orders = getSeedModel("orders");
  const storeResult = await Orders.deleteOne({ legacyId: normalized });
  if (storeResult.deletedCount > 0) return;

  const Legacy = getSeedModel("admin_orders");
  const legacyResult = await Legacy.deleteOne({ legacyId: normalized });
  if (legacyResult.deletedCount > 0) return;

  throw new Error("Order not found");
}
