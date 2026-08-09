import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canAccessPath } from "@/lib/auth/permissions";
import { getProducts } from "@/services/products";
import type { AdminOrderProductOption } from "@/types/admin-order-product";
import type { ProductSize } from "@/types/product";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !canAccessPath(session.role, "/dashboard/admin/orders")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const products = await getProducts();
    const options: AdminOrderProductOption[] = products.map((product) => ({
      id: product.id,
      title: product.title,
      slug: product.slug,
      price: product.pricing.price,
      compareAtPrice: product.pricing.compareAtPrice,
      currency: product.pricing.currency,
      image: product.images[0]?.url ?? "",
      sizes: product.attributes.sizes.length
        ? product.attributes.sizes
        : (["M"] as ProductSize[]),
      colors: product.attributes.colors.length
        ? product.attributes.colors
        : ["Default"],
    }));

    return NextResponse.json({ products: options });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load products";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
