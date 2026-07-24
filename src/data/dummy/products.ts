import type { Product } from "@/types/product";

type ProductSeed = {
  slug: string;
  name: string;
  description: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  image: string;
  colors: string[];
};

/**
 * Dummy product seed data.
 * Keep this folder as the only mock source until a real database is connected.
 * Service layer (`src/services/products.ts`) should be the only consumer for UI.
 */
const productSeeds: ProductSeed[] = [
  // Shirts (5)
  {
    slug: "oxford-cotton-shirt",
    name: "Oxford Cotton Shirt",
    description: "A clean everyday oxford shirt in breathable cotton.",
    category: "shirts",
    price: 3200,
    compareAtPrice: 3800,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    colors: ["White", "Sky Blue"],
  },
  {
    slug: "linen-camp-shirt",
    name: "Linen Camp Shirt",
    description: "Relaxed linen shirt for warm-weather days.",
    category: "shirts",
    price: 3600,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    colors: ["Sand", "Sky"],
  },
  {
    slug: "twill-button-down",
    name: "Twill Button Down",
    description: "Crisp twill shirt with a refined collar.",
    category: "shirts",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    colors: ["White", "Light Blue"],
  },
  {
    slug: "soft-poplin-shirt",
    name: "Soft Poplin Shirt",
    description: "Lightweight poplin for all-day comfort.",
    category: "shirts",
    price: 3000,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
    colors: ["Ivory", "Sage"],
  },
  {
    slug: "checked-casual-shirt",
    name: "Checked Casual Shirt",
    description: "Easy weekend shirt with a subtle check.",
    category: "shirts",
    price: 3100,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80",
    colors: ["Navy Check", "Grey Check"],
  },

  // T-Shirts (5)
  {
    slug: "essential-crew-tee",
    name: "Essential Crew Tee",
    description: "Soft cotton tee for everyday layering.",
    category: "t-shirts",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Olive"],
  },
  {
    slug: "heavyweight-pocket-tee",
    name: "Heavyweight Pocket Tee",
    description: "Structured tee with a clean chest pocket.",
    category: "t-shirts",
    price: 2100,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    colors: ["White", "Navy"],
  },
  {
    slug: "relaxed-graphic-tee",
    name: "Relaxed Graphic Tee",
    description: "Soft tee with a minimal front graphic.",
    category: "t-shirts",
    price: 1900,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    colors: ["Charcoal", "Cream"],
  },
  {
    slug: "premium-cotton-tee",
    name: "Premium Cotton Tee",
    description: "Fine cotton tee with a polished finish.",
    category: "t-shirts",
    price: 2200,
    compareAtPrice: 2500,
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "White"],
  },
  {
    slug: "oversized-studio-tee",
    name: "Oversized Studio Tee",
    description: "Roomy fit tee for off-duty days.",
    category: "t-shirts",
    price: 2000,
    image:
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=800&q=80",
    colors: ["Stone", "Ink"],
  },

  // Pants (5)
  {
    slug: "slim-chino-pants",
    name: "Slim Chino Pants",
    description: "Tailored chinos with a modern slim fit.",
    category: "pants",
    price: 3800,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    colors: ["Khaki", "Navy"],
  },
  {
    slug: "tapered-wool-trouser",
    name: "Tapered Wool Trouser",
    description: "Smart trousers for office and evenings.",
    category: "pants",
    price: 5200,
    compareAtPrice: 5800,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    colors: ["Charcoal", "Grey"],
  },
  {
    slug: "drawstring-travel-pants",
    name: "Drawstring Travel Pants",
    description: "Comfort-first pants ready for long days.",
    category: "pants",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Olive"],
  },
  {
    slug: "pleated-smart-pants",
    name: "Pleated Smart Pants",
    description: "Soft pleats with a clean tapered leg.",
    category: "pants",
    price: 4800,
    image:
      "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=800&q=80",
    colors: ["Beige", "Navy"],
  },
  {
    slug: "stretch-everyday-pants",
    name: "Stretch Everyday Pants",
    description: "Flexible pants that move with you.",
    category: "pants",
    price: 3900,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    colors: ["Grey", "Black"],
  },

  // Jeans (5)
  {
    slug: "urban-denim-jeans",
    name: "Urban Denim Jeans",
    description: "Durable denim with a clean tapered fit.",
    category: "jeans",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    colors: ["Indigo", "Black"],
  },
  {
    slug: "washed-straight-jeans",
    name: "Washed Straight Jeans",
    description: "Classic straight jeans with a soft wash.",
    category: "jeans",
    price: 4000,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    colors: ["Light Wash", "Dark Wash"],
  },
  {
    slug: "slim-indigo-jeans",
    name: "Slim Indigo Jeans",
    description: "Deep indigo jeans with a slim silhouette.",
    category: "jeans",
    price: 4300,
    image:
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80",
    colors: ["Indigo", "Rinse"],
  },
  {
    slug: "relaxed-selvedge-jeans",
    name: "Relaxed Selvedge Jeans",
    description: "Roomier jeans with selvedge detailing.",
    category: "jeans",
    price: 5600,
    compareAtPrice: 6200,
    image:
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80",
    colors: ["Raw", "Faded"],
  },
  {
    slug: "black-skinny-jeans",
    name: "Black Skinny Jeans",
    description: "Sleek black jeans for night-out looks.",
    category: "jeans",
    price: 4100,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Charcoal"],
  },

  // Outerwear (5)
  {
    slug: "lightweight-overshirt",
    name: "Lightweight Overshirt",
    description: "Easy layering piece for transitional weather.",
    category: "outerwear",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
    colors: ["Stone", "Olive"],
  },
  {
    slug: "field-utility-jacket",
    name: "Field Utility Jacket",
    description: "Functional jacket with clean utility pockets.",
    category: "outerwear",
    price: 6900,
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80",
    colors: ["Olive", "Black"],
  },
  {
    slug: "bomber-layer-jacket",
    name: "Bomber Layer Jacket",
    description: "Compact bomber for cooler evenings.",
    category: "outerwear",
    price: 6200,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    colors: ["Navy", "Black"],
  },
  {
    slug: "wool-blend-coat",
    name: "Wool Blend Coat",
    description: "Long coat with a clean winter profile.",
    category: "outerwear",
    price: 9800,
    compareAtPrice: 11000,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    colors: ["Camel", "Charcoal"],
  },
  {
    slug: "coach-shell-jacket",
    name: "Coach Shell Jacket",
    description: "Light shell jacket for city weather.",
    category: "outerwear",
    price: 5400,
    image:
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Forest"],
  },

  // Blazers (5)
  {
    slug: "structured-blazer",
    name: "Structured Blazer",
    description: "A sharp blazer for work and evenings.",
    category: "blazers",
    price: 8900,
    compareAtPrice: 9800,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    colors: ["Charcoal", "Navy"],
  },
  {
    slug: "soft-lapel-blazer",
    name: "Soft Lapel Blazer",
    description: "Unstructured blazer for easy smart looks.",
    category: "blazers",
    price: 8200,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    colors: ["Beige", "Navy"],
  },
  {
    slug: "navy-work-blazer",
    name: "Navy Work Blazer",
    description: "Reliable navy blazer for weekday polish.",
    category: "blazers",
    price: 8600,
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80",
    colors: ["Navy", "Ink"],
  },
  {
    slug: "check-smart-blazer",
    name: "Check Smart Blazer",
    description: "Subtle check blazer with a modern cut.",
    category: "blazers",
    price: 9100,
    image:
      "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=800&q=80",
    colors: ["Grey Check", "Brown Check"],
  },
  {
    slug: "linen-summer-blazer",
    name: "Linen Summer Blazer",
    description: "Breathable blazer for warmer seasons.",
    category: "blazers",
    price: 7800,
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80",
    colors: ["Sand", "Light Grey"],
  },

  // Shoes (5)
  {
    slug: "classic-leather-sneakers",
    name: "Classic Leather Sneakers",
    description: "Minimal sneakers finished in smooth leather.",
    category: "shoes",
    price: 5600,
    compareAtPrice: 6200,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    colors: ["White", "Tan"],
  },
  {
    slug: "derby-leather-shoes",
    name: "Derby Leather Shoes",
    description: "Polished derbies for formal and smart-casual wear.",
    category: "shoes",
    price: 7400,
    image:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    colors: ["Brown", "Black"],
  },
  {
    slug: "runner-lifestyle-sneakers",
    name: "Runner Lifestyle Sneakers",
    description: "Everyday runners with a clean profile.",
    category: "shoes",
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    colors: ["White", "Grey"],
  },
  {
    slug: "suede-court-sneakers",
    name: "Suede Court Sneakers",
    description: "Soft suede sneakers for casual fits.",
    category: "shoes",
    price: 4900,
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    colors: ["Navy", "Grey"],
  },
  {
    slug: "chelsea-boot",
    name: "Chelsea Boot",
    description: "Versatile boots with a sleek silhouette.",
    category: "shoes",
    price: 8200,
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Brown"],
  },

  // Accessories (5)
  {
    slug: "woven-leather-belt",
    name: "Woven Leather Belt",
    description: "Textured belt that finishes any outfit.",
    category: "accessories",
    price: 1600,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    colors: ["Brown", "Black"],
  },
  {
    slug: "merino-knit-scarf",
    name: "Merino Knit Scarf",
    description: "Soft scarf for cooler evenings.",
    category: "accessories",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80",
    colors: ["Camel", "Grey"],
  },
  {
    slug: "classic-cap",
    name: "Classic Cap",
    description: "Clean cap for everyday finishing.",
    category: "accessories",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Navy"],
  },
  {
    slug: "leather-card-holder",
    name: "Leather Card Holder",
    description: "Slim card holder in smooth leather.",
    category: "accessories",
    price: 1400,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    colors: ["Tan", "Black"],
  },
  {
    slug: "silk-pocket-square",
    name: "Silk Pocket Square",
    description: "Refined accent for formal looks.",
    category: "accessories",
    price: 900,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    colors: ["Ivory", "Navy"],
  },

  // Watches (5)
  {
    slug: "minimal-steel-watch",
    name: "Minimal Steel Watch",
    description: "Clean dial with a brushed steel bracelet.",
    category: "watches",
    price: 9800,
    compareAtPrice: 11000,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
    colors: ["Silver", "Black"],
  },
  {
    slug: "leather-strap-watch",
    name: "Leather Strap Watch",
    description: "Everyday watch with a refined leather strap.",
    category: "watches",
    price: 8600,
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
    colors: ["Tan", "Black"],
  },
  {
    slug: "chrono-sport-watch",
    name: "Chrono Sport Watch",
    description: "Sport chronograph with clear subdials.",
    category: "watches",
    price: 10500,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Steel"],
  },
  {
    slug: "mesh-bracelet-watch",
    name: "Mesh Bracelet Watch",
    description: "Slim watch with a mesh bracelet finish.",
    category: "watches",
    price: 7900,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    colors: ["Silver", "Rose"],
  },
  {
    slug: "field-utility-watch",
    name: "Field Utility Watch",
    description: "Rugged everyday watch with clear markers.",
    category: "watches",
    price: 7200,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
    colors: ["Olive", "Black"],
  },

  // Bags (5)
  {
    slug: "everyday-tote-bag",
    name: "Everyday Tote Bag",
    description: "Spacious tote for work and weekends.",
    category: "bags",
    price: 3900,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Olive"],
  },
  {
    slug: "compact-crossbody-bag",
    name: "Compact Crossbody Bag",
    description: "Hands-free bag for lighter days out.",
    category: "bags",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    colors: ["Brown", "Black"],
  },
  {
    slug: "structured-briefcase",
    name: "Structured Briefcase",
    description: "Clean briefcase for daily commute.",
    category: "bags",
    price: 7800,
    compareAtPrice: 8500,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Tan"],
  },
  {
    slug: "canvas-weekend-duffel",
    name: "Canvas Weekend Duffel",
    description: "Roomy duffel for short trips.",
    category: "bags",
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    colors: ["Navy", "Khaki"],
  },
  {
    slug: "slim-laptop-sleeve-bag",
    name: "Slim Laptop Sleeve Bag",
    description: "Protective bag with a slim everyday profile.",
    category: "bags",
    price: 3600,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    colors: ["Grey", "Black"],
  },
];

export const dummyProducts: Product[] = productSeeds.map((seed, index) => ({
  id: `p-${String(index + 1).padStart(3, "0")}`,
  slug: seed.slug,
  name: seed.name,
  description: seed.description,
  category: seed.category,
  price: seed.price,
  compareAtPrice: seed.compareAtPrice,
  currency: "BDT",
  sizes: ["S", "M", "L", "XL"],
  colors: seed.colors,
  images: [
    {
      src: seed.image,
      alt: seed.name,
    },
  ],
  featured: true,
  inStock: true,
}));
