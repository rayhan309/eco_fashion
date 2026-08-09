import type { ProductSize } from "@/types/product";

export type AdminOrderProductOption = {
  id: string;
  title: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  currency: "BDT" | "USD";
  image: string;
  sizes: ProductSize[];
  colors: string[];
};
