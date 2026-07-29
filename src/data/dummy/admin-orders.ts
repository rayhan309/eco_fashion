export type {
  AdminOrder,
  AdminOrderStatus,
} from "@/types/admin-order";

export {
  ADMIN_ORDER_STATUS_FILTERS,
  ADMIN_ORDER_STATUS_LABELS,
} from "@/types/admin-order";

/** Seed-only sample rows — storefront/admin live orders come from MongoDB `orders`. */
export const dummyAdminOrders = [] as import("@/types/admin-order").AdminOrder[];
