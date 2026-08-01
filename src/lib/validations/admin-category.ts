import { z } from "zod";
import { slugify } from "@/lib/utils/slugify";

export const adminCategoryFormSchema = z.object({
  name: z.string().trim().min(2, "Category name is required"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  image: z.string().trim().min(1, "Category image is required"),
  description: z.string().trim().default(""),
});

export type AdminCategoryFormValues = z.infer<typeof adminCategoryFormSchema>;

export const adminCategoryReorderSchema = z.object({
  orderedIds: z.array(z.string().min(1)).min(1),
});

export function slugifyCategoryName(value: string) {
  return slugify(value);
}
