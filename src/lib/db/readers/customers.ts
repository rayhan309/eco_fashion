import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import {
  computeCustomerStats,
  type AdminCustomer,
  type AdminCustomerStats,
} from "@/data/dummy/admin-customers";

function mapCustomerDoc(doc: Record<string, unknown>): AdminCustomer {
  return {
    id: String(doc.legacyId ?? doc.id ?? ""),
    name: String(doc.name ?? ""),
    phone: String(doc.phone ?? ""),
    address: String(doc.address ?? ""),
    orderCount: Number(doc.orderCount ?? 0),
    totalSpent: Number(doc.totalSpent ?? 0),
    lastOrderAt: String(doc.lastOrderAt ?? new Date().toISOString()),
  };
}

export async function readCustomersFromDb(): Promise<AdminCustomer[]> {
  await dbConnect();
  const Model = getSeedModel("customers");
  const docs = await Model.find({}).sort({ lastOrderAt: -1 }).lean();
  return docs.map((doc) => mapCustomerDoc(doc as unknown as Record<string, unknown>));
}

export async function getAdminCustomersFromDbOrFallback(): Promise<{
  customers: AdminCustomer[];
  stats: AdminCustomerStats;
}> {
  try {
    const customers = (await readCustomersFromDb()).sort(
      (a, b) => new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime(),
    );
    return { customers, stats: computeCustomerStats(customers) };
  } catch (error) {
    console.error("[db] customers read failed:", error);
    return { customers: [], stats: computeCustomerStats([]) };
  }
}
