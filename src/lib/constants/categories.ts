export type Category = {
  slug: string;
  name: string;
  description: string;
};

export const PRODUCT_CATEGORIES: Category[] = [
  {
    slug: "shirts",
    name: "Shirts",
    description: "Everyday and formal shirts for modern men.",
  },
  {
    slug: "pants",
    name: "Pants",
    description: "Tailored trousers, chinos, and casual pants.",
  },
  {
    slug: "outerwear",
    name: "Outerwear",
    description: "Jackets and coats built for layering.",
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Belts, bags, and finishing pieces.",
  },
];
