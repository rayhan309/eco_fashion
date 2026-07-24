export type ProductSize = "XS" | "S" | "M" | "L" | "XL" | "XXL";

export type ProductImage = {
  src: string;
  alt: string;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  currency: "BDT" | "USD";
  sizes: ProductSize[];
  colors: string[];
  images: ProductImage[];
  featured?: boolean;
  inStock: boolean;
};
