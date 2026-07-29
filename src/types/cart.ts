import type { Product, ProductSize } from "./product";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  /** Original price before discount; null/undefined if no compare-at. */
  compareAtPrice?: number | null;
  currency: Product["pricing"]["currency"];
  quantity: number;
  size: ProductSize;
  color: string;
  image: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  savings: number;
  currency: Product["pricing"]["currency"];
};
