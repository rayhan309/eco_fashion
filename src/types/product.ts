export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type ProductImage = {
  url: string;
  alt: string;
};

/** pricing Object (4) */
export type ProductPricing = {
  price: number;
  compareAtPrice: number | null;
  currency: "BDT" | "USD";
  discountPercent: number;
};

/** inventory Object (3) */
export type ProductInventory = {
  sku: string;
  quantity: number;
  inStock: boolean;
};

/** attributes Object (8) */
export type ProductAttributes = {
  sizes: ProductSize[];
  colors: string[];
  material: string;
  fit: string;
  care: string;
  gender: string;
  season: string;
  style: string;
};

/** ratings Object (2) */
export type ProductRatings = {
  average: number;
  count: number;
};

/**
 * Product data model — same shape expected from a future database / API.
 */
export type Product = {
  id: string;
  title: string;
  slug: string;
  brand_or_vendor: string;
  category: string;
  category_id: string;
  category_slug: string;
  description: string;
  tags: string[];
  pricing: ProductPricing;
  inventory: ProductInventory;
  attributes: ProductAttributes;
  ratings: ProductRatings;
  images: ProductImage[];
  createdAt: string;
  updatedAt: string;
};
