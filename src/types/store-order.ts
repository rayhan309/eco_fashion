import type { CartItem } from "@/types/cart";
import type { AdminOrderStatus } from "@/types/admin-order";

export type StoreOrderCustomer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  region: string;
  city: string;
  note: string;
  /** Selected shipping area label from site settings. */
  deliveryArea: string;
};

export type StoreOrderItem = CartItem;

export type StoreOrder = {
  id: string;
  orderNumber: string;
  status: AdminOrderStatus;
  customer: StoreOrderCustomer;
  items: StoreOrderItem[];
  itemCount: number;
  itemsSummary: string;
  subtotal: number;
  shippingFee: number;
  /** Order-level discount subtracted from subtotal + shipping. */
  orderDiscount?: number;
  total: number;
  currency: "BDT";
  paymentMethod: "cod";
  createdAt: string;
  updatedAt: string;
  steadfastConsignmentId?: string | number | null;
  steadfastTrackingCode?: string;
  steadfastSentAt?: string;
};

export type CreateStoreOrderInput = {
  customer: StoreOrderCustomer;
  items: StoreOrderItem[];
  shippingFee: number;
  deliveryAreaId?: string;
};
