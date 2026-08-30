import { z } from "zod";

<<<<<<< HEAD
export const adminOrderLineItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string(),
  name: z.string().min(1),
  price: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
  quantity: z.coerce.number().int().min(1),
  size: z.string(),
  color: z.string(),
  image: z.string(),
=======
export const adminOrderItemSchema = z.object({
  productId: z.string().trim().min(1),
  slug: z.string().trim(),
  name: z.string().trim().min(1, "Product name is required"),
  price: z.coerce.number().min(0, "Price must be 0 or more"),
  discount: z.coerce.number().min(0).default(0),
  currency: z.enum(["BDT", "USD"]).default("BDT"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
  size: z
    .enum(["XS", "S", "M", "L", "XL", "XXL"])
    .or(z.string().trim())
    .transform((value) => {
      const allowed = ["XS", "S", "M", "L", "XL", "XXL"] as const;
      return (allowed.includes(value as (typeof allowed)[number])
        ? value
        : "M") as (typeof allowed)[number];
    })
    .default("M"),
  color: z.string().trim().default("Default"),
  image: z.string().trim().default(""),
>>>>>>> cf78953116bac3a4109b3e0c1d7b2f731d0144d0
  compareAtPrice: z.coerce.number().nullable().optional(),
});

export const adminOrderUpdateSchema = z.object({
  status: z.enum([
    "new_order",
    "order_confirmed",
    "entered_steadfast",
    "no_response",
    "will_inform_later",
    "follow_up_needed",
    "out_for_delivery",
    "scammer_fraudulent",
    "delivered",
    "cancelled",
  ]),
  deliveryAreaId: z.string().trim().optional(),
  items: z.array(adminOrderLineItemSchema).min(1, "Add at least one product"),
  shippingFee: z.coerce.number().min(0),
  orderDiscount: z.coerce.number().min(0).default(0),
  customer: z.object({
    name: z.string().trim().min(2, "Name is required"),
    phone: z.string().trim().min(8, "Phone is required"),
    email: z.string().trim().email("Enter a valid email").or(z.literal("")),
    address: z.string().trim(),
    region: z.string().trim(),
    city: z.string().trim(),
    note: z.string().trim(),
    deliveryArea: z.string().trim().optional(),
  }),
  items: z.array(adminOrderItemSchema).min(1, "Add at least one product"),
  shippingFee: z.coerce.number().min(0),
  discount: z.coerce.number().min(0).default(0),
});

export type AdminOrderLineItemValues = z.infer<typeof adminOrderLineItemSchema>;
export type AdminOrderUpdateValues = z.infer<typeof adminOrderUpdateSchema>;
<<<<<<< HEAD

export function calcLineSubtotal(price: number, discount: number, quantity: number) {
  return Math.max(0, (price - discount) * quantity);
}

export function calcOrderTotals(
  items: Pick<AdminOrderLineItemValues, "price" | "discount" | "quantity">[],
  shippingFee: number,
  orderDiscount: number,
) {
  const subtotal = items.reduce(
    (sum, item) => sum + calcLineSubtotal(item.price, item.discount, item.quantity),
    0,
  );
  const total = Math.max(0, subtotal + shippingFee - orderDiscount);
  return { subtotal, total };
}
=======
export type AdminOrderItemValues = z.infer<typeof adminOrderItemSchema>;
>>>>>>> cf78953116bac3a4109b3e0c1d7b2f731d0144d0
