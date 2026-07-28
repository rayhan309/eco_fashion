import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import {
  adminActivities,
  adminQuickActions,
  adminRecentOrders,
  adminStats,
  adminSummaryCards,
  revenueByMonth,
  type AdminActivity,
  type AdminQuickAction,
  type AdminRecentOrder,
  type AdminStat,
  type AdminSummaryCard,
  type RevenuePoint,
} from "@/data/dummy/admin-overview";
import type { AdminOverviewData } from "@/services/admin";

const FALLBACK: AdminOverviewData = {
  stats: [...adminStats],
  revenueByMonth: [...revenueByMonth],
  activities: [...adminActivities],
  quickActions: [...adminQuickActions],
  recentOrders: [...adminRecentOrders],
  summaryCards: [...adminSummaryCards],
};

export async function readAdminOverviewFromDb(): Promise<AdminOverviewData | null> {
  await dbConnect();
  const Model = getSeedModel("admin_overview");
  const doc = await Model.findOne({ legacyId: "admin-overview" }).lean();
  if (!doc) return null;

  const row = doc as unknown as Record<string, unknown>;
  return {
    stats: (row.stats as AdminStat[]) ?? FALLBACK.stats,
    revenueByMonth: (row.revenueByMonth as RevenuePoint[]) ?? FALLBACK.revenueByMonth,
    activities: (row.activities as AdminActivity[]) ?? FALLBACK.activities,
    quickActions: (row.quickActions as AdminQuickAction[]) ?? FALLBACK.quickActions,
    recentOrders: (row.recentOrders as AdminRecentOrder[]) ?? FALLBACK.recentOrders,
    summaryCards: (row.summaryCards as AdminSummaryCard[]) ?? FALLBACK.summaryCards,
  };
}

export async function getAdminOverviewFromDbOrFallback(): Promise<AdminOverviewData> {
  try {
    const fromDb = await readAdminOverviewFromDb();
    if (fromDb) return fromDb;
  } catch (error) {
    console.error("[db] admin_overview read failed:", error);
  }
  return FALLBACK;
}
