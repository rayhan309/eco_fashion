import { dummyCategories } from "@/data/dummy/categories";
import type { Product, ProductSize } from "@/types/product";

type ProductSeed = {
  slug: string;
  title: string;
  description: string;
  category_slug: string;
  price: number;
  compareAtPrice?: number;
  /** Multiple product images (url list). Falls back to `image` + `imageSecondary`. */
  images?: string[];
  image: string;
  imageSecondary?: string;
  colors: string[];
  material?: string;
  fit?: string;
  style?: string;
  brand?: string;
};

const categoryBySlug = Object.fromEntries(
  dummyCategories.map((category) => [category.slug, category]),
);

/**
 * Dummy product seed data.
 * Keep this folder as the only mock source until a real database is connected.
 * Service layer (`src/services/products.ts`) should be the only consumer for UI.
 */
const productSeeds: ProductSeed[] = [
  // Shirts (5)
  {
    slug: "oxford-cotton-shirt",
    title: "Oxford Cotton Shirt",
    description: "A clean everyday oxford shirt in breathable cotton.",
    category_slug: "shirts",
    price: 3200,
    compareAtPrice: 3800,
    image:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    colors: ["White", "Sky Blue"],
    material: "Cotton",
    fit: "Regular",
    style: "Casual",
  },
  {
    slug: "linen-camp-shirt",
    title: "Linen Camp Shirt",
    description: "Relaxed linen shirt for warm-weather days.",
    category_slug: "shirts",
    price: 3600,
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
    colors: ["Sand", "Sky"],
    material: "Linen",
    fit: "Relaxed",
    style: "Casual",
  },
  {
    slug: "twill-button-down",
    title: "Twill Button Down",
    description: "Crisp twill shirt with a refined collar.",
    category_slug: "shirts",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80",
    colors: ["White", "Light Blue"],
    material: "Cotton Twill",
    fit: "Slim",
    style: "Smart Casual",
  },
  {
    slug: "soft-poplin-shirt",
    title: "Soft Poplin Shirt",
    description: "Lightweight poplin for all-day comfort.",
    category_slug: "shirts",
    price: 3000,
    image:
      "https://images.unsplash.com/photo-1603252109303-2751441dd157?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=800&q=80",
    colors: ["Ivory", "Sage"],
    material: "Poplin",
    fit: "Regular",
    style: "Casual",
  },
  {
    slug: "checked-casual-shirt",
    title: "Checked Casual Shirt",
    description: "Easy weekend shirt with a subtle check.",
    category_slug: "shirts",
    price: 3100,
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80",
    colors: ["Navy Check", "Grey Check"],
    material: "Cotton",
    fit: "Regular",
    style: "Casual",
  },

  // T-Shirts (5)
  {
    slug: "essential-crew-tee",
    title: "Essential Crew Tee",
    description: "Soft cotton tee for everyday layering.",
    category_slug: "t-shirts",
    price: 1800,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Olive"],
    material: "Cotton",
    fit: "Regular",
    style: "Basics",
  },
  {
    slug: "heavyweight-pocket-tee",
    title: "Heavyweight Pocket Tee",
    description: "Structured tee with a clean chest pocket.",
    category_slug: "t-shirts",
    price: 2100,
    image:
      "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    colors: ["White", "Navy"],
    material: "Cotton",
    fit: "Regular",
    style: "Basics",
  },
  {
    slug: "relaxed-graphic-tee",
    title: "Relaxed Graphic Tee",
    description: "Soft tee with a minimal front graphic.",
    category_slug: "t-shirts",
    price: 1900,
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=800&q=80",
    colors: ["Charcoal", "Cream"],
    material: "Cotton",
    fit: "Relaxed",
    style: "Street",
  },
  {
    slug: "premium-cotton-tee",
    title: "Premium Cotton Tee",
    description: "Fine cotton tee with a polished finish.",
    category_slug: "t-shirts",
    price: 2200,
    compareAtPrice: 2500,
    image:
      "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "White"],
    material: "Pima Cotton",
    fit: "Slim",
    style: "Basics",
  },
  {
    slug: "oversized-studio-tee",
    title: "Oversized Studio Tee",
    description: "Roomy fit tee for off-duty days.",
    category_slug: "t-shirts",
    price: 2000,
    image:
      "https://images.unsplash.com/photo-1618354691438-25bc04584c23?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80",
    colors: ["Stone", "Ink"],
    material: "Cotton",
    fit: "Oversized",
    style: "Street",
  },

  // Pants (5)
  {
    slug: "slim-chino-pants",
    title: "Slim Chino Pants",
    description: "Tailored chinos with a modern slim fit.",
    category_slug: "pants",
    price: 3800,
    image:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    colors: ["Khaki", "Navy"],
    material: "Cotton Twill",
    fit: "Slim",
    style: "Smart Casual",
  },
  {
    slug: "tapered-wool-trouser",
    title: "Tapered Wool Trouser",
    description: "Smart trousers for office and evenings.",
    category_slug: "pants",
    price: 5200,
    compareAtPrice: 5800,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=800&q=80",
    colors: ["Charcoal", "Grey"],
    material: "Wool Blend",
    fit: "Tapered",
    style: "Formal",
  },
  {
    slug: "drawstring-travel-pants",
    title: "Drawstring Travel Pants",
    description: "Comfort-first pants ready for long days.",
    category_slug: "pants",
    price: 3500,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Olive"],
    material: "Stretch Cotton",
    fit: "Relaxed",
    style: "Travel",
  },
  {
    slug: "pleated-smart-pants",
    title: "Pleated Smart Pants",
    description: "Soft pleats with a clean tapered leg.",
    category_slug: "pants",
    price: 4800,
    image:
      "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    colors: ["Beige", "Navy"],
    material: "Wool Blend",
    fit: "Tapered",
    style: "Smart Casual",
  },
  {
    slug: "stretch-everyday-pants",
    title: "Stretch Everyday Pants",
    description: "Flexible pants that move with you.",
    category_slug: "pants",
    price: 3900,
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?auto=format&fit=crop&w=800&q=80",
    colors: ["Grey", "Black"],
    material: "Stretch Twill",
    fit: "Regular",
    style: "Casual",
  },

  // Jeans (5)
  {
    slug: "urban-denim-jeans",
    title: "Urban Denim Jeans",
    description: "Durable denim with a clean tapered fit.",
    category_slug: "jeans",
    price: 4200,
    image:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    colors: ["Indigo", "Black"],
    material: "Denim",
    fit: "Tapered",
    style: "Casual",
  },
  {
    slug: "washed-straight-jeans",
    title: "Washed Straight Jeans",
    description: "Classic straight jeans with a soft wash.",
    category_slug: "jeans",
    price: 4000,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80",
    colors: ["Light Wash", "Dark Wash"],
    material: "Denim",
    fit: "Straight",
    style: "Casual",
  },
  {
    slug: "slim-indigo-jeans",
    title: "Slim Indigo Jeans",
    description: "Deep indigo jeans with a slim silhouette.",
    category_slug: "jeans",
    price: 4300,
    image:
      "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    colors: ["Indigo", "Rinse"],
    material: "Denim",
    fit: "Slim",
    style: "Casual",
  },
  {
    slug: "relaxed-selvedge-jeans",
    title: "Relaxed Selvedge Jeans",
    description: "Roomier jeans with selvedge detailing.",
    category_slug: "jeans",
    price: 5600,
    compareAtPrice: 6200,
    image:
      "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    colors: ["Raw", "Faded"],
    material: "Selvedge Denim",
    fit: "Relaxed",
    style: "Casual",
  },
  {
    slug: "black-skinny-jeans",
    title: "Black Skinny Jeans",
    description: "Sleek black jeans for night-out looks.",
    category_slug: "jeans",
    price: 4100,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Charcoal"],
    material: "Stretch Denim",
    fit: "Skinny",
    style: "Street",
  },

  // Outerwear (5)
  {
    slug: "lightweight-overshirt",
    title: "Lightweight Overshirt",
    description: "Easy layering piece for transitional weather.",
    category_slug: "outerwear",
    price: 4500,
    image:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    colors: ["Stone", "Olive"],
    material: "Cotton",
    fit: "Regular",
    style: "Layering",
  },
  {
    slug: "field-utility-jacket",
    title: "Field Utility Jacket",
    description: "Functional jacket with clean utility pockets.",
    category_slug: "outerwear",
    price: 6900,
    image:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
    colors: ["Olive", "Black"],
    material: "Cotton Blend",
    fit: "Regular",
    style: "Utility",
  },
  {
    slug: "bomber-layer-jacket",
    title: "Bomber Layer Jacket",
    description: "Compact bomber for cooler evenings.",
    category_slug: "outerwear",
    price: 6200,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80",
    colors: ["Navy", "Black"],
    material: "Nylon",
    fit: "Regular",
    style: "Casual",
  },
  {
    slug: "wool-blend-coat",
    title: "Wool Blend Coat",
    description: "Long coat with a clean winter profile.",
    category_slug: "outerwear",
    price: 9800,
    compareAtPrice: 11000,
    image:
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=800&q=80",
    colors: ["Camel", "Charcoal"],
    material: "Wool Blend",
    fit: "Regular",
    style: "Formal",
  },
  {
    slug: "coach-shell-jacket",
    title: "Coach Shell Jacket",
    description: "Light shell jacket for city weather.",
    category_slug: "outerwear",
    price: 5400,
    image:
      "https://images.unsplash.com/photo-1556306535-0f09a537f0a3?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Forest"],
    material: "Shell",
    fit: "Regular",
    style: "Casual",
  },

  // Blazers (5)
  {
    slug: "structured-blazer",
    title: "Structured Blazer",
    description: "A sharp blazer for work and evenings.",
    category_slug: "blazers",
    price: 8900,
    compareAtPrice: 9800,
    image:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80",
    colors: ["Charcoal", "Navy"],
    material: "Wool Blend",
    fit: "Tailored",
    style: "Formal",
  },
  {
    slug: "soft-lapel-blazer",
    title: "Soft Lapel Blazer",
    description: "Unstructured blazer for easy smart looks.",
    category_slug: "blazers",
    price: 8200,
    image:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80",
    colors: ["Beige", "Navy"],
    material: "Linen Blend",
    fit: "Relaxed",
    style: "Smart Casual",
  },
  {
    slug: "navy-work-blazer",
    title: "Navy Work Blazer",
    description: "Reliable navy blazer for weekday polish.",
    category_slug: "blazers",
    price: 8600,
    image:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    colors: ["Navy", "Ink"],
    material: "Wool",
    fit: "Tailored",
    style: "Formal",
  },
  {
    slug: "check-smart-blazer",
    title: "Check Smart Blazer",
    description: "Subtle check blazer with a modern cut.",
    category_slug: "blazers",
    price: 9100,
    image:
      "https://images.unsplash.com/photo-1594938291221-94f18cbb5660?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1617127365659-c47fa864d8bc?auto=format&fit=crop&w=800&q=80",
    colors: ["Grey Check", "Brown Check"],
    material: "Wool Blend",
    fit: "Slim",
    style: "Smart Casual",
  },
  {
    slug: "linen-summer-blazer",
    title: "Linen Summer Blazer",
    description: "Breathable blazer for warmer seasons.",
    category_slug: "blazers",
    price: 7800,
    image:
      "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=800&q=80",
    colors: ["Sand", "Light Grey"],
    material: "Linen",
    fit: "Regular",
    style: "Smart Casual",
  },

  // Shoes (5)
  {
    slug: "classic-leather-sneakers",
    title: "Classic Leather Sneakers",
    description: "Minimal sneakers finished in smooth leather.",
    category_slug: "shoes",
    price: 5600,
    compareAtPrice: 6200,
    image:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    colors: ["White", "Tan"],
    material: "Leather",
    fit: "True to size",
    style: "Casual",
  },
  {
    slug: "derby-leather-shoes",
    title: "Derby Leather Shoes",
    description: "Polished derbies for formal and smart-casual wear.",
    category_slug: "shoes",
    price: 7400,
    image:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80",
    colors: ["Brown", "Black"],
    material: "Leather",
    fit: "True to size",
    style: "Formal",
  },
  {
    slug: "runner-lifestyle-sneakers",
    title: "Runner Lifestyle Sneakers",
    description: "Everyday runners with a clean profile.",
    category_slug: "shoes",
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=800&q=80",
    colors: ["White", "Grey"],
    material: "Mesh / Rubber",
    fit: "True to size",
    style: "Sport",
  },
  {
    slug: "suede-court-sneakers",
    title: "Suede Court Sneakers",
    description: "Soft suede sneakers for casual fits.",
    category_slug: "shoes",
    price: 4900,
    image:
      "https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=800&q=80",
    colors: ["Navy", "Grey"],
    material: "Suede",
    fit: "True to size",
    style: "Casual",
  },
  {
    slug: "chelsea-boot",
    title: "Chelsea Boot",
    description: "Versatile boots with a sleek silhouette.",
    category_slug: "shoes",
    price: 8200,
    image:
      "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Brown"],
    material: "Leather",
    fit: "True to size",
    style: "Smart Casual",
  },

  // Accessories (5)
  {
    slug: "woven-leather-belt",
    title: "Woven Leather Belt",
    description: "Textured belt that finishes any outfit.",
    category_slug: "accessories",
    price: 1600,
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    colors: ["Brown", "Black"],
    material: "Leather",
    fit: "Adjustable",
    style: "Essentials",
  },
  {
    slug: "merino-knit-scarf",
    title: "Merino Knit Scarf",
    description: "Soft scarf for cooler evenings.",
    category_slug: "accessories",
    price: 2200,
    image:
      "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    colors: ["Camel", "Grey"],
    material: "Merino Wool",
    fit: "One size",
    style: "Seasonal",
  },
  {
    slug: "classic-cap",
    title: "Classic Cap",
    description: "Clean cap for everyday finishing.",
    category_slug: "accessories",
    price: 1200,
    image:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Navy"],
    material: "Cotton",
    fit: "One size",
    style: "Casual",
  },
  {
    slug: "leather-card-holder",
    title: "Leather Card Holder",
    description: "Slim card holder in smooth leather.",
    category_slug: "accessories",
    price: 1400,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80",
    colors: ["Tan", "Black"],
    material: "Leather",
    fit: "One size",
    style: "Essentials",
  },
  {
    slug: "silk-pocket-square",
    title: "Silk Pocket Square",
    description: "Refined accent for formal looks.",
    category_slug: "accessories",
    price: 900,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=80",
    colors: ["Ivory", "Navy"],
    material: "Silk",
    fit: "One size",
    style: "Formal",
  },

  // Watches (5)
  {
    slug: "minimal-steel-watch",
    title: "Minimal Steel Watch",
    description: "Clean dial with a brushed steel bracelet.",
    category_slug: "watches",
    price: 9800,
    compareAtPrice: 11000,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
    colors: ["Silver", "Black"],
    material: "Stainless Steel",
    fit: "One size",
    style: "Minimal",
  },
  {
    slug: "leather-strap-watch",
    title: "Leather Strap Watch",
    description: "Everyday watch with a refined leather strap.",
    category_slug: "watches",
    price: 8600,
    image:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    colors: ["Tan", "Black"],
    material: "Steel / Leather",
    fit: "One size",
    style: "Classic",
  },
  {
    slug: "chrono-sport-watch",
    title: "Chrono Sport Watch",
    description: "Sport chronograph with clear subdials.",
    category_slug: "watches",
    price: 10500,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Steel"],
    material: "Stainless Steel",
    fit: "One size",
    style: "Sport",
  },
  {
    slug: "mesh-bracelet-watch",
    title: "Mesh Bracelet Watch",
    description: "Slim watch with a mesh bracelet finish.",
    category_slug: "watches",
    price: 7900,
    image:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80",
    colors: ["Silver", "Rose"],
    material: "Stainless Steel",
    fit: "One size",
    style: "Minimal",
  },
  {
    slug: "field-utility-watch",
    title: "Field Utility Watch",
    description: "Rugged everyday watch with clear markers.",
    category_slug: "watches",
    price: 7200,
    image:
      "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80",
    colors: ["Olive", "Black"],
    material: "Steel / Nylon",
    fit: "One size",
    style: "Utility",
  },

  // Bags (5)
  {
    slug: "everyday-tote-bag",
    title: "Everyday Tote Bag",
    description: "Spacious tote for work and weekends.",
    category_slug: "bags",
    price: 3900,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Olive"],
    material: "Canvas",
    fit: "One size",
    style: "Everyday",
  },
  {
    slug: "compact-crossbody-bag",
    title: "Compact Crossbody Bag",
    description: "Hands-free bag for lighter days out.",
    category_slug: "bags",
    price: 3400,
    image:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    colors: ["Brown", "Black"],
    material: "Leather",
    fit: "One size",
    style: "Casual",
  },
  {
    slug: "structured-briefcase",
    title: "Structured Briefcase",
    description: "Clean briefcase for daily commute.",
    category_slug: "bags",
    price: 7800,
    compareAtPrice: 8500,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    colors: ["Black", "Tan"],
    material: "Leather",
    fit: "One size",
    style: "Work",
  },
  {
    slug: "canvas-weekend-duffel",
    title: "Canvas Weekend Duffel",
    description: "Roomy duffel for short trips.",
    category_slug: "bags",
    price: 5200,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=80",
    colors: ["Navy", "Khaki"],
    material: "Canvas",
    fit: "One size",
    style: "Travel",
  },
  {
    slug: "slim-laptop-sleeve-bag",
    title: "Slim Laptop Sleeve Bag",
    description: "Protective bag with a slim everyday profile.",
    category_slug: "bags",
    price: 3600,
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80",
    imageSecondary:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
    colors: ["Grey", "Black"],
    material: "Nylon",
    fit: "One size",
    style: "Work",
  },
];

const defaultSizes: ProductSize[] = ["S", "M", "L", "XL"];

function discountPercent(price: number, compareAtPrice?: number) {
  if (!compareAtPrice || compareAtPrice <= price) return 0;
  return Math.round(((compareAtPrice - price) / compareAtPrice) * 100);
}

export const dummyProducts: Product[] = productSeeds.map((seed, index) => {
  const category = categoryBySlug[seed.category_slug];
  const createdAt = new Date(Date.UTC(2026, 0, 1 + (index % 28))).toISOString();
  const imageUrls =
    seed.images && seed.images.length > 0
      ? seed.images
      : [seed.image, seed.imageSecondary ?? seed.image];

  return {
    id: `p-${String(index + 1).padStart(3, "0")}`,
    title: seed.title,
    slug: seed.slug,
    brand_or_vendor: seed.brand ?? "Hidden Urban",
    category: category?.title ?? seed.category_slug,
    category_id: category?.id ?? `cat-${seed.category_slug}`,
    category_slug: seed.category_slug,
    description: seed.description,
    tags: [],
    pricing: {
      price: seed.price,
      compareAtPrice: seed.compareAtPrice ?? null,
      currency: "BDT",
      discountPercent: discountPercent(seed.price, seed.compareAtPrice),
    },
    inventory: {
      sku: `EF-${seed.category_slug.slice(0, 3).toUpperCase()}-${String(index + 1).padStart(4, "0")}`,
      quantity: 24 + (index % 20),
      inStock: true,
    },
    attributes: {
      sizes: defaultSizes,
      colors: seed.colors,
      material: seed.material ?? "Mixed",
      fit: seed.fit ?? "Regular",
      care: "Follow care label",
      gender: "Men",
      season: "All season",
      style: seed.style ?? "Casual",
    },
    ratings: {
      average: Number((4.2 + (index % 8) * 0.1).toFixed(1)),
      count: 12 + index * 3,
    },
    images: imageUrls.map((url, imageIndex) => ({
      url,
      alt:
        imageIndex === 0
          ? seed.title
          : `${seed.title} view ${imageIndex + 1}`,
    })),
    createdAt,
    updatedAt: createdAt,
  };
});
