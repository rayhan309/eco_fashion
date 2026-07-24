import type { ClientReview } from "@/types/review";

/**
 * Dummy client review seed data.
 * Keep this folder as the only mock source until a real database is connected.
 */
export const dummyReviews: ClientReview[] = [
  {
    id: "rev-001",
    name: "Arif Rahman",
    role: "Product Designer",
    location: "Dhaka",
    rating: 5,
    comment:
      "The oxford shirt fits perfectly and feels premium. Clean stitching, great fabric — already ordered a second color.",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    productTitle: "Oxford Cotton Shirt",
  },
  {
    id: "rev-002",
    name: "Nayeem Hasan",
    role: "Software Engineer",
    location: "Chattogram",
    rating: 5,
    comment:
      "Chinos are sharp and comfortable for long office days. Delivery was quick and packaging felt thoughtful.",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    productTitle: "Slim Chino Pants",
  },
  {
    id: "rev-003",
    name: "Sabbir Ahmed",
    role: "Founder",
    location: "Sylhet",
    rating: 4,
    comment:
      "Blazer looks tailored without feeling stiff. Exactly what I needed for meetings and evening events.",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80",
    productTitle: "Structured Blazer",
  },
  {
    id: "rev-004",
    name: "Rafi Khan",
    role: "Photographer",
    location: "Dhaka",
    rating: 5,
    comment:
      "Love the overshirt. Easy to layer, holds shape well, and the color matches almost everything I wear.",
    avatar:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80",
    productTitle: "Lightweight Overshirt",
  },
  {
    id: "rev-005",
    name: "Imran Chowdhury",
    role: "Marketing Lead",
    location: "Rajshahi",
    rating: 5,
    comment:
      "Sneakers are clean and versatile. Quality leather, soft insole — worth every taka for daily wear.",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    productTitle: "Classic Leather Sneakers",
  },
  {
    id: "rev-006",
    name: "Tanvir Alam",
    role: "Architect",
    location: "Khulna",
    rating: 4,
    comment:
      "Watch looks minimal and expensive. Great finishing details and pairs well with both casual and formal outfits.",
    avatar:
      "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=200&q=80",
    productTitle: "Minimal Steel Watch",
  },
];
