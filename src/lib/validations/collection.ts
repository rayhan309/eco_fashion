import { z } from "zod";
import { slugifyTitle } from "@/lib/validations/product";

export const collectionFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  slug: z
    .string()
    .min(2, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens"),
  description: z.string().min(1, "Description is required"),
  image: z.string().optional(),
  productIds: z.array(z.string()),
});

export type CollectionFormValues = z.infer<typeof collectionFormSchema>;

export function slugifyCollectionTitle(value: string) {
  return slugifyTitle(value);
}

export function parseProductIdsInput(value: string) {
  return value
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);
}
