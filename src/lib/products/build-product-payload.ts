import {
  normalizeVariantsFromForm,
  summarizeVariants,
} from "@/lib/products/variant-utils";
import {
  calcDiscountPercent,
  type AddProductFormValues,
} from "@/lib/validations/product";

function parseMoney(value: string | undefined) {
  return Number(String(value ?? "").replace(/,/g, "").trim());
}

export function buildStoredProductFields(data: AddProductFormValues) {
  if (data.productType === "variable") {
    const variants = normalizeVariantsFromForm(data.variants);
    const summary = summarizeVariants(variants);
    return {
      productType: data.productType as "variable",
      variants,
      regularPrice: summary.regularPrice,
      salePrice: summary.salePrice,
      discountPercent: summary.discountPercent,
      stockQuantity: summary.stockQuantity,
      stockStatus: summary.stockStatus,
    };
  }

  const regularPrice = parseMoney(data.regularPrice);
  const salePrice = data.salePrice?.trim() ? parseMoney(data.salePrice) : null;

  return {
    productType: "regular" as const,
    variants: [],
    regularPrice,
    salePrice,
    discountPercent: calcDiscountPercent(regularPrice, salePrice),
    stockQuantity: data.stockQuantity?.trim() ? Number(data.stockQuantity) : 0,
    stockStatus: data.stockStatus,
  };
}
