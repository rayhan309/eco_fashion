import {
  adminRecentOrders,
  adminStats,
  revenueByMonth,
  salesByCategory,
  topProducts,
  type AdminRecentOrder,
  type AdminStat,
  type CategorySalesPoint,
  type RevenuePoint,
  type TopProduct,
} from "@/data/dummy/admin-overview";

export type AdminOverviewData = {
  stats: AdminStat[];
  revenueByMonth: RevenuePoint[];
  salesByCategory: CategorySalesPoint[];
  recentOrders: AdminRecentOrder[];
  topProducts: TopProduct[];
};

export async function getAdminOverview(): Promise<AdminOverviewData> {
  return {
    stats: [...adminStats],
    revenueByMonth: [...revenueByMonth],
    salesByCategory: [...salesByCategory],
    recentOrders: [...adminRecentOrders],
    topProducts: [...topProducts],
  };
}
