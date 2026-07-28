import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import {
  dummyAdminOrders,
  type AdminOrder,
  type AdminOrderStatus,
} from "@/data/dummy/admin-orders";

const STATUSES: AdminOrderStatus[] = [
  "new_order",
  "order_confirmed",
  "entered_steadfast",
  "no_response",
  "will_inform_later",
  "follow_up_needed",
  "out_for_delivery",
  "scammer_fraudulent",
  "delivered",
  "cancelled",
];

function mapOrderDoc(doc: Record<string, unknown>): AdminOrder {
  const status = String(doc.status ?? "new_order");
  return {
    id: String(doc.legacyId ?? doc.id ?? ""),
    orderNumber: String(doc.orderNumber ?? ""),
    customerName: String(doc.customerName ?? ""),
    customerPhone: String(doc.customerPhone ?? ""),
    itemsSummary: String(doc.itemsSummary ?? ""),
    itemCount: Number(doc.itemCount ?? 0),
    total: Number(doc.total ?? 0),
    currency: "BDT",
    status: STATUSES.includes(status as AdminOrderStatus)
      ? (status as AdminOrderStatus)
      : "new_order",
    createdAt: String(doc.createdAt ?? new Date().toISOString()),
  };
}

export async function readAdminOrdersFromDb(): Promise<AdminOrder[]> {
  await dbConnect();
  const Model = getSeedModel("admin_orders");
  const docs = await Model.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((doc) => mapOrderDoc(doc as unknown as Record<string, unknown>));
}

export async function getAdminOrdersFromDbOrFallback(): Promise<AdminOrder[]> {
  try {
    const rows = await readAdminOrdersFromDb();
    if (rows.length > 0) {
      return rows.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
    }
  } catch (error) {
    console.error("[db] admin_orders read failed:", error);
  }
  return [...dummyAdminOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
