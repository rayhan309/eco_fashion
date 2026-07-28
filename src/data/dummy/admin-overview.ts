export type AdminStat = {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  accent: string;
  sparkline: number[];
};

export type RevenuePoint = {
  month: string;
  revenue: number;
  orders: number;
};

export type AdminActivity = {
  id: string;
  message: string;
  timeAgo: string;
};

export type AdminQuickAction = {
  id: string;
  label: string;
  href: string;
};

export type AdminSummaryCard = {
  id: string;
  label: string;
  value: string;
  sublabel: string;
  borderColor?: string;
};

export type AdminRecentOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
};

export const adminStats: AdminStat[] = [
  {
    id: "revenue",
    label: "Total revenue",
    value: "৳4,28,500",
    sublabel: "From paid orders",
    accent: "#3b82f6",
    sparkline: [12, 18, 15, 22, 28, 24, 32, 30, 38, 42],
  },
  {
    id: "orders",
    label: "Total orders",
    value: "186",
    sublabel: "All time",
    accent: "#1f6f5b",
    sparkline: [8, 12, 10, 14, 18, 16, 20, 22, 24, 26],
  },
  {
    id: "products",
    label: "Products",
    value: "50",
    sublabel: "In catalog",
    accent: "#e6a34a",
    sparkline: [20, 20, 22, 21, 23, 22, 24, 25, 26, 28],
  },
  {
    id: "customers",
    label: "Customers",
    value: "1,248",
    sublabel: "Registered",
    accent: "#ef4444",
    sparkline: [40, 42, 45, 48, 52, 55, 58, 62, 65, 68],
  },
];

export const revenueByMonth: RevenuePoint[] = [
  { month: "Feb", revenue: 268000, orders: 101 },
  { month: "Mar", revenue: 312000, orders: 118 },
  { month: "Apr", revenue: 289000, orders: 109 },
  { month: "May", revenue: 356000, orders: 134 },
  { month: "Jun", revenue: 398000, orders: 151 },
  { month: "Jul", revenue: 428500, orders: 186 },
];

export const adminActivities: AdminActivity[] = [
  {
    id: "act-1",
    message: "Low stock — Slim Chino Pants",
    timeAgo: "2 days ago",
  },
  {
    id: "act-2",
    message: "New order EF-10588 received",
    timeAgo: "3 days ago",
  },
  {
    id: "act-3",
    message: "Classic Oxford Shirt restocked",
    timeAgo: "5 days ago",
  },
];

export const adminQuickActions: AdminQuickAction[] = [
  { id: "qa-1", label: "Add product", href: "/dashboard/admin/products" },
  { id: "qa-2", label: "View orders", href: "/dashboard/admin/orders" },
  { id: "qa-3", label: "Categories", href: "/dashboard/admin/categories" },
];

export const adminSummaryCards: AdminSummaryCard[] = [
  {
    id: "pending",
    label: "Pending orders",
    value: "12",
    sublabel: "Awaiting fulfillment",
    borderColor: "#e6a34a",
  },
  {
    id: "aov",
    label: "Avg. order value",
    value: "৳2,304",
    sublabel: "Per completed order",
  },
  {
    id: "stock",
    label: "Out of stock",
    value: "3",
    sublabel: "Products need restock",
    borderColor: "#ef4444",
  },
];

/** Empty state for overview — set to [] to match empty recent orders UI */
export const adminRecentOrders: AdminRecentOrder[] = [];
