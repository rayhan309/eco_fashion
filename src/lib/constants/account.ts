export const ACCOUNT_TABS = ["profile", "orders", "wishlist", "cart"] as const;

export type AccountTab = (typeof ACCOUNT_TABS)[number];

export function isAccountTab(value: string | null | undefined): value is AccountTab {
  return Boolean(value && ACCOUNT_TABS.includes(value as AccountTab));
}

export function resolveAccountTab(value: string | null | undefined): AccountTab {
  return isAccountTab(value) ? value : "profile";
}

export const ACCOUNT_TAB_LABELS: Record<AccountTab, string> = {
  profile: "Profile",
  orders: "Orders",
  wishlist: "Wishlist",
  cart: "Cart",
};
