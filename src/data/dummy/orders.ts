export type OrderStatus = "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type Order = {
  id: string;
  orderNumber: string;
  date: string;
  status: OrderStatus;
  total: number;
  currency: "BDT";
  itemCount: number;
};

/**
 * Dummy order seed data for account page.
 */
export const dummyOrders: Order[] = [
  {
    id: "ord-001",
    orderNumber: "EF-10482",
    date: "2026-07-12",
    status: "Delivered",
    total: 7000,
    currency: "BDT",
    itemCount: 2,
  },
  {
    id: "ord-002",
    orderNumber: "EF-10519",
    date: "2026-07-18",
    status: "Shipped",
    total: 8900,
    currency: "BDT",
    itemCount: 1,
  },
  {
    id: "ord-003",
    orderNumber: "EF-10544",
    date: "2026-07-22",
    status: "Processing",
    total: 5600,
    currency: "BDT",
    itemCount: 1,
  },
];
