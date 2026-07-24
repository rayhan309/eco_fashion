import type { Product, ProductSize } from "./product";

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  currency: Product["currency"];
  quantity: number;
  size: ProductSize;
  color: string;
  image: string;
};

export type Cart = {
  items: CartItem[];
  subtotal: number;
  currency: Product["currency"];
};
