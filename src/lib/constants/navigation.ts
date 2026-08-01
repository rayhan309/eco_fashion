export type NavItem = {
  label: string;
  href: string;
};

type CategoryNavSource = {
  title: string;
  slug: string;
};

function categoryNavItems(categories: CategoryNavSource[]): NavItem[] {
  return categories
    .filter((category) => Boolean(category.slug && category.title))
    .map((category) => ({
      label: category.title,
      href: `/shop/${category.slug}`,
    }));
}

/** Desktop header: Shop + admin categories + Collections + About */
export function buildMainNav(categories: CategoryNavSource[]): NavItem[] {
  return [
    { label: "Shop", href: "/shop" },
    ...categoryNavItems(categories),
    { label: "Collections", href: "/collections" },
    { label: "About", href: "/about" },
  ];
}

/** Mobile drawer links */
export function buildMobileNav(categories: CategoryNavSource[]): NavItem[] {
  return [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/shop" },
    ...categoryNavItems(categories),
    { label: "Collections", href: "/collections" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Cart", href: "/cart" },
  ];
}

/** Footer shop column */
export function buildFooterShop(categories: CategoryNavSource[]): NavItem[] {
  return [{ label: "Shop All", href: "/shop" }, ...categoryNavItems(categories)];
}

export const FOOTER_HELP: NavItem[] = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Track order", href: "/track-order" },
  { label: "Cart", href: "/cart" },
  { label: "Checkout", href: "/checkout" },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];
