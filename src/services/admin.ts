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

export type AdminOverviewData = {
  stats: AdminStat[];
  revenueByMonth: RevenuePoint[];
  activities: AdminActivity[];
  quickActions: AdminQuickAction[];
  recentOrders: AdminRecentOrder[];
  summaryCards: AdminSummaryCard[];
};

export async function getAdminOverview(): Promise<AdminOverviewData> {
  return {
    stats: [...adminStats],
    revenueByMonth: [...revenueByMonth],
    activities: [...adminActivities],
    quickActions: [...adminQuickActions],
    recentOrders: [...adminRecentOrders],
    summaryCards: [...adminSummaryCards],
  };
}
