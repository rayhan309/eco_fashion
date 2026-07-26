export type AdminStat = {
  id: string;
  label: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "neutral";
  hint: string;
};

export type RevenuePoint = {
  month: string;
  revenue: number;
  orders: number;
};

export type CategorySalesPoint = {
  name: string;
  sales: number;
  fill: string;
};

export type AdminRecentOrder = {
  id: string;
  orderNumber: string;
  customer: string;
  date: string;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  total: number;
};

export type TopProduct = {
  id: string;
  title: string;
  category: string;
  sold: number;
  revenue: number;
};

export const adminStats: AdminStat[] = [
  {
    id: "revenue",
    label: "Revenue",
    value: "৳4,28,500",
    change: "+12.4%",
    changeType: "up",
    hint: "vs last month",
  },
  {
    id: "orders",
    label: "Orders",
    value: "186",
    change: "+8.1%",
    changeType: "up",
    hint: "vs last month",
  },
  {
    id: "customers",
    label: "Customers",
    value: "1,248",
    change: "+5.6%",
    changeType: "up",
    hint: "active buyers",
  },
  {
    id: "products",
    label: "Products",
    value: "50",
    change: "0%",
    changeType: "neutral",
    hint: "in catalog",
  },
];

export const revenueByMonth: RevenuePoint[] = [
  { month: "Jan", revenue: 245000, orders: 92 },
  { month: "Feb", revenue: 268000, orders: 101 },
  { month: "Mar", revenue: 312000, orders: 118 },
  { month: "Apr", revenue: 289000, orders: 109 },
  { month: "May", revenue: 356000, orders: 134 },
  { month: "Jun", revenue: 398000, orders: 151 },
  { month: "Jul", revenue: 428500, orders: 186 },
];

export const salesByCategory: CategorySalesPoint[] = [
  { name: "Shirts", sales: 128000, fill: "#1f6f5b" },
  { name: "Pants", sales: 98000, fill: "#2d8f75" },
  { name: "Outerwear", sales: 76000, fill: "#e6a34a" },
  { name: "Shoes", sales: 64000, fill: "#c4843a" },
  { name: "Accessories", sales: 42500, fill: "#61716a" },
];

export const adminRecentOrders: AdminRecentOrder[] = [
  {
    id: "ord-a1",
    orderNumber: "EF-10588",
    customer: "Rafi Ahmed",
    date: "2026-07-25",
    status: "Processing",
    total: 7200,
  },
  {
    id: "ord-a2",
    orderNumber: "EF-10571",
    customer: "Sabbir Hasan",
    date: "2026-07-24",
    status: "Shipped",
    total: 11500,
  },
  {
    id: "ord-a3",
    orderNumber: "EF-10544",
    customer: "Imran Khan",
    date: "2026-07-22",
    status: "Processing",
    total: 5600,
  },
  {
    id: "ord-a4",
    orderNumber: "EF-10519",
    customer: "Nayeem Islam",
    date: "2026-07-18",
    status: "Shipped",
    total: 8900,
  },
  {
    id: "ord-a5",
    orderNumber: "EF-10482",
    customer: "Arif Rahman",
    date: "2026-07-12",
    status: "Delivered",
    total: 7000,
  },
];

export const topProducts: TopProduct[] = [
  {
    id: "tp-1",
    title: "Classic Oxford Shirt",
    category: "Shirts",
    sold: 84,
    revenue: 126000,
  },
  {
    id: "tp-2",
    title: "Slim Chino Pants",
    category: "Pants",
    sold: 71,
    revenue: 106500,
  },
  {
    id: "tp-3",
    title: "Structured Blazer",
    category: "Outerwear",
    sold: 38,
    revenue: 152000,
  },
  {
    id: "tp-4",
    title: "Leather Belt",
    category: "Accessories",
    sold: 96,
    revenue: 48000,
  },
];
