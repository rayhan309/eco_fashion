import type { AdminOrderStatus } from "@/types/admin-order";

export type CourierStats = {
  available: boolean;
  successRate: number;
  total: number;
  delivered: number;
  cancelled: number;
  rating: string;
  risk: string;
  error?: string;
};

export type SiteOrderHistoryItem = {
  id: string;
  orderNumber: string;
  isCurrent: boolean;
  status: AdminOrderStatus;
  statusLabel: string;
  itemsSummary: string;
  subtotal: number;
  shippingFee: number;
  total: number;
  address: string;
  createdAt: string;
  steadfastConsignmentId?: string | number | null;
  shipmentNote: string;
};

export type OrderHistoryResponse = {
  customerName: string;
  customerPhone: string;
  shopLabel: string;
  siteOrderCount: number;
  siteShipmentCount: number;
  pathaoStats: CourierStats;
  steadfastStats: CourierStats;
  siteOrders: SiteOrderHistoryItem[];
};

export type StoredOrderHistoryEntry = {
  at: string;
  title: string;
  detail?: string;
  source?: "site" | "steadfast";
};
