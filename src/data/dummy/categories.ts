import type { Category } from "@/types/category";

/**
 * Dummy category seed data.
 * Keep this folder as the only mock source until a real database is connected.
 * Service layer (`src/services/categories.ts`) should be the only consumer.
 */
export const dummyCategories: Category[] = [
  {
    id: "cat-001",
    title: "Shirts",
    slug: "shirts",
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80",
    rating: 4.9,
  },
  {
    id: "cat-002",
    title: "T-Shirts",
    slug: "t-shirts",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=400&q=80",
    rating: 4.7,
  },
  {
    id: "cat-003",
    title: "Pants",
    slug: "pants",
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=400&q=80",
    rating: 4.8,
  },
  {
    id: "cat-004",
    title: "Jeans",
    slug: "jeans",
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=400&q=80",
    rating: 4.6,
  },
  {
    id: "cat-005",
    title: "Outerwear",
    slug: "outerwear",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=400&q=80",
    rating: 4.85,
  },
  {
    id: "cat-006",
    title: "Blazers",
    slug: "blazers",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=400&q=80",
    rating: 4.5,
  },
  {
    id: "cat-007",
    title: "Shoes",
    slug: "shoes",
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=400&q=80",
    rating: 4.75,
  },
  {
    id: "cat-008",
    title: "Accessories",
    slug: "accessories",
    image:
      "https://images.unsplash.com/photo-1520975661595-6453be3f7070?auto=format&fit=crop&w=400&q=80",
    rating: 4.4,
  },
  {
    id: "cat-009",
    title: "Watches",
    slug: "watches",
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=400&q=80",
    rating: 4.65,
  },
  {
    id: "cat-010",
    title: "Bags",
    slug: "bags",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=400&q=80",
    rating: 4.55,
  },
];
