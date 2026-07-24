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
  { label: "Account", href: "/account?tab=profile" },
  { label: "Wishlist", href: "/account?tab=wishlist" },
  { label: "Orders", href: "/account?tab=orders" },
  { label: "Cart", href: "/account?tab=cart" },
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
  { label: "Account", href: "/account?tab=profile" },
  { label: "Orders", href: "/account?tab=orders" },
  { label: "Wishlist", href: "/account?tab=wishlist" },
  { label: "Cart", href: "/account?tab=cart" },
  { label: "Checkout", href: "/checkout" },
];

export const FOOTER_NAV: NavItem[] = [
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Account", href: "/account?tab=profile" },
];
