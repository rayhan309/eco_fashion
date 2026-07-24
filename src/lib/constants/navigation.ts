export type NavItem = {
  label: string;
  href: string;
};

export const MAIN_NAV: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Shirts", href: "/shop/shirts" },
  { label: "Pants", href: "/shop/pants" },
  { label: "Collections", href: "/collections/essentials" },
  { label: "About", href: "/about" },
];

export const MOBILE_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Shirts", href: "/shop/shirts" },
  { label: "Pants", href: "/shop/pants" },
  { label: "Outerwear", href: "/shop/outerwear" },
  { label: "Accessories", href: "/shop/accessories" },
  { label: "Collections", href: "/collections/essentials" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Account", href: "/account" },
  { label: "Wishlist", href: "/account/wishlist" },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Account", href: "/account" },
];
