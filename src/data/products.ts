import type { Product } from "@/types/product";

export const products: Product[] = [
  {
    id: "p-001",
    slug: "oxford-cotton-shirt",
    name: "Oxford Cotton Shirt",
    description: "A clean everyday oxford shirt in breathable cotton.",
    category: "shirts",
    price: 3200,
    currency: "BDT",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White", "Sky Blue"],
    images: [
      {
        src: "/images/products/oxford-cotton-shirt.jpg",
        alt: "Oxford cotton shirt",
      },
    ],
    featured: true,
    inStock: true,
  },
  {
    id: "p-002",
    slug: "slim-chino-pants",
    name: "Slim Chino Pants",
    description: "Tailored chinos with a modern slim fit.",
    category: "pants",
    price: 3800,
    currency: "BDT",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Khaki", "Navy"],
    images: [
      {
        src: "/images/products/slim-chino-pants.jpg",
        alt: "Slim chino pants",
      },
    ],
    featured: true,
    inStock: true,
  },
];
