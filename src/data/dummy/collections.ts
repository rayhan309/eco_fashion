import type { Collection } from "@/types/collection";

/**
 * Dummy collection seed data.
 * Keep this folder as the only mock source until a real database is connected.
 */
export const dummyCollections: Collection[] = [
  {
    id: "col-001",
    title: "Essentials",
    slug: "essentials",
    description: "Everyday foundations — shirts, tees, and trousers you’ll reach for often.",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=1200&q=80",
    productIds: ["p-001", "p-002", "p-006", "p-007", "p-011", "p-013", "p-016", "p-019"],
  },
  {
    id: "col-002",
    title: "Work Ready",
    slug: "work-ready",
    description: "Sharp pieces for meetings, desks, and evenings that follow.",
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    productIds: ["p-001", "p-011", "p-012", "p-013", "p-014", "p-023", "p-024", "p-033"],
  },
  {
    id: "col-003",
    title: "Weekend Edit",
    slug: "weekend-edit",
    description: "Relaxed layers and easy fits for off-duty days.",
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80",
    productIds: ["p-003", "p-008", "p-009", "p-016", "p-017", "p-018", "p-031", "p-036"],
  },
  {
    id: "col-004",
    title: "New Season",
    slug: "new-season",
    description: "Fresh drops and seasonal updates for the modern wardrobe.",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=1200&q=80",
    productIds: ["p-004", "p-005", "p-010", "p-015", "p-020", "p-025", "p-030", "p-040"],
  },
];
