import type { Product } from "@/types/product";

export function formatCurrency(
  amount: number,
  currency: Product["pricing"]["currency"] = "BDT",
  locale = "en-BD",
) {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
