export type NavItem = {
  label: string;
  href: string;
};

export const MAIN_NAV: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "Shirts", href: "/shop/shirts" },
  { label: "Pants", href: "/shop/pants" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
];

export const MOBILE_NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Shirts", href: "/shop/shirts" },
  { label: "Pants", href: "/shop/pants" },
  { label: "Outerwear", href: "/shop/outerwear" },
  { label: "Accessories", href: "/shop/accessories" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Cart", href: "/cart" },
];

export const FOOTER_SHOP: NavItem[] = [
  { label: "Shop All", href: "/shop" },
  { label: "Shirts", href: "/shop/shirts" },
  { label: "T-Shirts", href: "/shop/t-shirts" },
  { label: "Pants", href: "/shop/pants" },
  { label: "Jeans", href: "/shop/jeans" },
  { label: "Outerwear", href: "/shop/outerwear" },
  { label: "Shoes", href: "/shop/shoes" },
  { label: "Accessories", href: "/shop/accessories" },
];

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
