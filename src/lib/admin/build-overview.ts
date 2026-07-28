import {
  adminQuickActions,
  type AdminActivity,
  type AdminRecentOrder,
  type AdminStat,
  type AdminSummaryCard,
  type RevenuePoint,
} from "@/data/dummy/admin-overview";
import type { AdminOverviewData } from "@/services/admin";
import type { AdminOrder, AdminOrderStatus } from "@/data/dummy/admin-orders";
import { getAdminOrdersFromDbOrFallback } from "@/lib/db/readers/admin-orders";
import { getAdminCustomersFromDbOrFallback } from "@/lib/db/readers/customers";
import { getProductsFromDbOrFallback } from "@/lib/db/readers/products";
import type { Product } from "@/types/product";

const REVENUE_EXCLUDED: AdminOrderStatus[] = ["cancelled", "scammer_fraudulent"];

const PENDING_STATUSES: AdminOrderStatus[] = [
  "new_order",
  "order_confirmed",
  "entered_steadfast",
  "no_response",
  "will_inform_later",
  "follow_up_needed",
];

function formatBdt(value: number) {
  return `৳${Math.round(value).toLocaleString("en-BD")}`;
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diffMs / 86_400_000);
  if (days < 1) return "Today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

function mapRecentStatus(status: AdminOrderStatus): AdminRecentOrder["status"] {
  if (status === "delivered") return "Delivered";
  if (status === "cancelled") return "Cancelled";
  if (status === "out_for_delivery" || status === "entered_steadfast") return "Shipped";
  return "Processing";
}

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function lastMonths(count: number) {
  const months: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i -= 1) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      label: d.toLocaleDateString("en-GB", { month: "short" }),
    });
  }
  return months;
}

function sparkline(values: number[], length = 10): number[] {
  const slice = values.slice(-length);
  if (slice.length === 0) return Array.from({ length }, () => 0);
  while (slice.length < length) {
    slice.unshift(slice[0] ?? 0);
  }
  return slice;
}

function countOutOfStock(products: Product[]) {
  return products.filter((p) => !p.inventory.inStock || p.inventory.quantity <= 0).length;
}

function buildRevenueSeries(orders: AdminOrder[]): RevenuePoint[] {
  const months = lastMonths(6);
  const byKey = new Map<string, { revenue: number; orders: number }>();

  for (const order of orders) {
    if (REVENUE_EXCLUDED.includes(order.status)) continue;
    const d = new Date(order.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const bucket = byKey.get(key) ?? { revenue: 0, orders: 0 };
    bucket.revenue += order.total;
    bucket.orders += 1;
    byKey.set(key, bucket);
  }

  return months.map(({ key, label }) => {
    const bucket = byKey.get(key) ?? { revenue: 0, orders: 0 };
    return { month: label, revenue: bucket.revenue, orders: bucket.orders };
  });
}

function buildActivities(orders: AdminOrder[], products: Product[]): AdminActivity[] {
  const activities: AdminActivity[] = [];

  for (const order of orders.slice(0, 3)) {
    activities.push({
      id: `order-${order.id}`,
      message: `New order ${order.orderNumber} received`,
      timeAgo: timeAgo(order.createdAt),
    });
  }

  const lowStock = products
    .filter((p) => p.inventory.inStock && p.inventory.quantity > 0 && p.inventory.quantity <= 5)
    .slice(0, 2);

  for (const product of lowStock) {
    activities.push({
      id: `stock-${product.id}`,
      message: `Low stock — ${product.title}`,
      timeAgo: "Recently",
    });
  }

  const outOfStock = products.filter((p) => !p.inventory.inStock).slice(0, 1);
  for (const product of outOfStock) {
    activities.push({
      id: `oos-${product.id}`,
      message: `Out of stock — ${product.title}`,
      timeAgo: "Recently",
    });
  }

  return activities.slice(0, 6);
}

export async function buildAdminOverviewFromLiveData(): Promise<AdminOverviewData> {
  const [orders, products, { customers }] = await Promise.all([
    getAdminOrdersFromDbOrFallback(),
    getProductsFromDbOrFallback(),
    getAdminCustomersFromDbOrFallback(),
  ]);

  const countableOrders = orders.filter((o) => !REVENUE_EXCLUDED.includes(o.status));
  const totalRevenue = countableOrders.reduce((sum, o) => sum + o.total, 0);
  const revenueByMonth = buildRevenueSeries(orders);
  const monthlyRevenues = revenueByMonth.map((p) => p.revenue);
  const monthlyOrderCounts = revenueByMonth.map((p) => p.orders);

  const pendingCount = orders.filter((o) => PENDING_STATUSES.includes(o.status)).length;
  const deliveredCount = orders.filter((o) => o.status === "delivered").length;
  const aov = deliveredCount > 0 ? totalRevenue / deliveredCount : countableOrders.length > 0
    ? totalRevenue / countableOrders.length
    : 0;
  const outOfStock = countOutOfStock(products);

  const stats: AdminStat[] = [
    {
      id: "revenue",
      label: "Total revenue",
      value: formatBdt(totalRevenue),
      sublabel: "From paid orders",
      accent: "#3b82f6",
      sparkline: sparkline(monthlyRevenues),
    },
    {
      id: "orders",
      label: "Total orders",
      value: String(orders.length),
      sublabel: "All time",
      accent: "#1f6f5b",
      sparkline: sparkline(monthlyOrderCounts),
    },
    {
      id: "products",
      label: "Products",
      value: String(products.length),
      sublabel: "In catalog",
      accent: "#e6a34a",
      sparkline: sparkline([products.length]),
    },
    {
      id: "customers",
      label: "Customers",
      value: customers.length.toLocaleString("en-BD"),
      sublabel: "Registered",
      accent: "#ef4444",
      sparkline: sparkline([customers.length]),
    },
  ];

  const recentOrders: AdminRecentOrder[] = orders.slice(0, 5).map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customer: order.customerName,
    date: formatOrderDate(order.createdAt),
    status: mapRecentStatus(order.status),
    total: order.total,
  }));

  const summaryCards: AdminSummaryCard[] = [
    {
      id: "pending",
      label: "Pending orders",
      value: String(pendingCount),
      sublabel: "Awaiting fulfillment",
      borderColor: "#e6a34a",
    },
    {
      id: "aov",
      label: "Avg. order value",
      value: formatBdt(aov),
      sublabel: "Per completed order",
    },
    {
      id: "stock",
      label: "Out of stock",
      value: String(outOfStock),
      sublabel: "Products need restock",
      borderColor: "#ef4444",
    },
  ];

  return {
    stats,
    revenueByMonth,
    activities: buildActivities(orders, products),
    quickActions: [...adminQuickActions],
    recentOrders,
    summaryCards,
  };
}
