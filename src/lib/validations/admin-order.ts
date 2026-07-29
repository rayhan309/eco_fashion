import { z } from "zod";

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
});

export type AdminOrderUpdateValues = z.infer<typeof adminOrderUpdateSchema>;
