export type AdminNavItem = {
  label: string;
  href: string;
};

export const ADMIN_NAV: AdminNavItem[] = [
  { label: "Overview", href: "/dashboard/admin" },
  { label: "Products", href: "/dashboard/admin/products" },
  { label: "Orders", href: "/dashboard/admin/orders" },
  { label: "Categories", href: "/dashboard/admin/categories" },
  { label: "Collections", href: "/dashboard/admin/collections" },
  { label: "Customers", href: "/dashboard/admin/customers" },
  { label: "Settings", href: "/dashboard/admin/settings" },
];
