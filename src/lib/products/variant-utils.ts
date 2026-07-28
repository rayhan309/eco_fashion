import type { stockStatuses, ProductVariantFormValues } from "@/lib/validations/product";

export type StockStatus = (typeof stockStatuses)[number];

export type StoredProductVariant = {
  label: string;
  regularPrice: number;
  salePrice: number | null;
  stockQuantity: number;
  stockStatus: StockStatus;
};

function parseMoney(value: string | undefined) {
  const n = Number(String(value ?? "").replace(/,/g, "").trim());
  return Number.isFinite(n) ? n : NaN;
}

export function normalizeVariantsFromForm(
  variants: ProductVariantFormValues[],
): StoredProductVariant[] {
  return variants.map((variant) => {
    const regularPrice = parseMoney(variant.regularPrice);
    const saleRaw = variant.salePrice?.trim();
    const salePrice = saleRaw ? parseMoney(saleRaw) : null;
    const stockQuantity = variant.stockQuantity?.trim()
      ? Number(variant.stockQuantity)
      : 0;

    return {
      label: variant.label.trim(),
      regularPrice: Number.isFinite(regularPrice) ? regularPrice : 0,
      salePrice:
        salePrice != null && Number.isFinite(salePrice) && salePrice > 0 ? salePrice : null,
      stockQuantity: Number.isFinite(stockQuantity) ? stockQuantity : 0,
      stockStatus: variant.stockStatus,
    };
  });
}

export function variantsFormFromStored(raw: unknown): ProductVariantFormValues[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const salePrice = row.salePrice;
    return {
      label: String(row.label ?? ""),
      regularPrice: String(row.regularPrice ?? ""),
      salePrice:
        salePrice != null && salePrice !== "" ? String(salePrice) : "",
      stockQuantity: String(row.stockQuantity ?? 0),
      stockStatus: (row.stockStatus as StockStatus) ?? "in_stock",
    };
  });
}

/** Derive parent price/stock fields for catalog + ProductModel from variant rows. */
export function summarizeVariants(variants: StoredProductVariant[]) {
  if (variants.length === 0) {
    return {
      regularPrice: 0,
      salePrice: null as number | null,
      discountPercent: 0,
      stockQuantity: 0,
      stockStatus: "out_of_stock" as StockStatus,
    };
  }

  let minEffective = Infinity;
  let minRegular = Infinity;
  let minSale: number | null = null;
  let totalStock = 0;
  let anyInStock = false;

  for (const variant of variants) {
    const regular = variant.regularPrice;
    const sale = variant.salePrice;
    const effective = sale != null && sale < regular ? sale : regular;
    if (effective < minEffective) {
      minEffective = effective;
      minRegular = regular;
      minSale = sale != null && sale < regular ? sale : null;
    }
    if (variant.stockStatus === "in_stock" && variant.stockQuantity > 0) {
      anyInStock = true;
      totalStock += variant.stockQuantity;
    }
  }

  const regularPrice = Number.isFinite(minRegular) ? minRegular : 0;
  const salePrice = minSale;
  const discountPercent =
    salePrice != null && regularPrice > 0
      ? Math.round((1 - salePrice / regularPrice) * 100)
      : 0;

  return {
    regularPrice,
    salePrice,
    discountPercent,
    stockQuantity: totalStock,
    stockStatus: (anyInStock ? "in_stock" : "out_of_stock") as StockStatus,
  };
}

export function variantSizeOptions(variants: StoredProductVariant[]): string[] {
  return variants.map((v) => v.label).filter(Boolean);
}

export function storedVariantsFromDoc(raw: unknown): StoredProductVariant[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const row = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
    const sale = row.salePrice;
    return {
      label: String(row.label ?? ""),
      regularPrice: Number(row.regularPrice ?? 0),
      salePrice: sale != null && sale !== "" ? Number(sale) : null,
      stockQuantity: Number(row.stockQuantity ?? 0),
      stockStatus: (row.stockStatus as StockStatus) ?? "out_of_stock",
    };
  });
}
