export type AdminOrderStatus =
  | "new_order"
  | "order_confirmed"
  | "entered_steadfast"
  | "no_response"
  | "will_inform_later"
  | "follow_up_needed"
  | "out_for_delivery"
  | "scammer_fraudulent"
  | "delivered"
  | "cancelled";

export type AdminOrder = {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  itemsSummary: string;
  itemCount: number;
  total: number;
  currency: "BDT";
  status: AdminOrderStatus;
  createdAt: string;
};

export const ADMIN_ORDER_STATUS_LABELS: Record<AdminOrderStatus, string> = {
  new_order: "New order",
  order_confirmed: "Order confirmed",
  entered_steadfast: "Entered in Steadfast",
  no_response: "No response",
  will_inform_later: "Will inform later",
  follow_up_needed: "Follow-up needed",
  out_for_delivery: "Out for delivery",
  scammer_fraudulent: "Scammer / fraudulent",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ADMIN_ORDER_STATUS_FILTERS: { id: "all" | AdminOrderStatus; label: string }[] = [
  { id: "all", label: "All" },
  { id: "new_order", label: "New order" },
  { id: "order_confirmed", label: "Order confirmed" },
  { id: "entered_steadfast", label: "Entered in Steadfast" },
  { id: "no_response", label: "No response" },
  { id: "will_inform_later", label: "Will inform later" },
  { id: "follow_up_needed", label: "Follow-up needed" },
  { id: "out_for_delivery", label: "Out for delivery" },
  { id: "scammer_fraudulent", label: "Scammer / fraudulent" },
];

export const dummyAdminOrders: AdminOrder[] = [
  {
    id: "adm-ord-1",
    orderNumber: "EF-10602",
    customerName: "Rayhan Ahmed",
    customerPhone: "01712345678",
    itemsSummary: "Classic Oxford Shirt",
    itemCount: 1,
    total: 860,
    currency: "BDT",
    status: "new_order",
    createdAt: "2026-07-28T13:59:00+06:00",
  },
  {
    id: "adm-ord-2",
    orderNumber: "EF-10588",
    customerName: "Rafi Ahmed",
    customerPhone: "01876543210",
    itemsSummary: "Slim Chino Pants, Leather Belt",
    itemCount: 2,
    total: 7200,
    currency: "BDT",
    status: "order_confirmed",
    createdAt: "2026-07-25T10:22:00+06:00",
  },
  {
    id: "adm-ord-3",
    orderNumber: "EF-10571",
    customerName: "Sabbir Hasan",
    customerPhone: "01911223344",
    itemsSummary: "Structured Blazer",
    itemCount: 1,
    total: 11500,
    currency: "BDT",
    status: "entered_steadfast",
    createdAt: "2026-07-24T16:45:00+06:00",
  },
  {
    id: "adm-ord-4",
    orderNumber: "EF-10544",
    customerName: "Imran Khan",
    customerPhone: "01655443322",
    itemsSummary: "Cotton Polo T-Shirt",
    itemCount: 1,
    total: 5600,
    currency: "BDT",
    status: "out_for_delivery",
    createdAt: "2026-07-22T09:15:00+06:00",
  },
  {
    id: "adm-ord-5",
    orderNumber: "EF-10519",
    customerName: "Nayeem Islam",
    customerPhone: "01566778899",
    itemsSummary: "Denim Jacket",
    itemCount: 1,
    total: 8900,
    currency: "BDT",
    status: "delivered",
    createdAt: "2026-07-18T14:30:00+06:00",
  },
  {
    id: "adm-ord-6",
    orderNumber: "EF-10482",
    customerName: "Arif Rahman",
    customerPhone: "01700000000",
    itemsSummary: "Oxford Shirt, Chino Pants",
    itemCount: 2,
    total: 7000,
    currency: "BDT",
    status: "will_inform_later",
    createdAt: "2026-07-12T11:08:00+06:00",
  },
];
