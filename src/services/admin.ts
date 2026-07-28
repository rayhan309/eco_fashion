import { buildAdminOverviewFromLiveData } from "@/lib/admin/build-overview";
import type {
  AdminActivity,
  AdminQuickAction,
  AdminRecentOrder,
  AdminStat,
  AdminSummaryCard,
  RevenuePoint,
} from "@/data/dummy/admin-overview";

export type AdminOverviewData = {
  stats: AdminStat[];
  revenueByMonth: RevenuePoint[];
  activities: AdminActivity[];
  quickActions: AdminQuickAction[];
  recentOrders: AdminRecentOrder[];
  summaryCards: AdminSummaryCard[];
};

export async function getAdminOverview(): Promise<AdminOverviewData> {
  return buildAdminOverviewFromLiveData();
}
