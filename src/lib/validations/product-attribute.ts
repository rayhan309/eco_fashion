import { z } from "zod";
import { slugifyTitle } from "@/lib/validations/product";

export const productAttributeFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  nameBn: z.string().min(1, "Bangla name is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  placeholder: z.string().min(1, "Placeholder is required"),
});

export type ProductAttributeFormValues = z.infer<typeof productAttributeFormSchema>;

export function slugifyAttributeName(value: string) {
  return slugifyTitle(value);
}
