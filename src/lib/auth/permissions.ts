import type { AdminRole } from "@/lib/validations/admin-user";

/** Paths each role may access under /dashboard/admin */
export const ROLE_ALLOWED_PREFIXES: Record<AdminRole, string[]> = {
  super_admin: ["/dashboard/admin"],
  shop_manager: [
    "/dashboard/admin/products",
    "/dashboard/admin/categories",
    "/dashboard/admin/collections",
    "/dashboard/admin/customers",
  ],
  moderator: ["/dashboard/admin/orders"],
};

export const ROLE_HOME: Record<AdminRole, string> = {
  super_admin: "/dashboard/admin",
  shop_manager: "/dashboard/admin/products",
  moderator: "/dashboard/admin/orders",
};

export function canAccessPath(role: AdminRole, pathname: string): boolean {
  if (role === "super_admin") return pathname.startsWith("/dashboard/admin");

  return ROLE_ALLOWED_PREFIXES[role].some((prefix) => {
    if (pathname === prefix) return true;
    return pathname.startsWith(`${prefix}/`);
  });
}

export function canManageUsers(role: AdminRole): boolean {
  return role === "super_admin";
}

/** Super Admin and Shop Manager can create, update, and delete products. */
export function canManageProducts(role: AdminRole): boolean {
  return role === "super_admin" || role === "shop_manager";
}
