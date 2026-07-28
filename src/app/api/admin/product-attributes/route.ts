import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canAccessPath, canManageProducts } from "@/lib/auth/permissions";
import { createProductAttributeInDb } from "@/lib/db/product-attribute-mutations";
import { productAttributeFormSchema } from "@/lib/validations/product-attribute";
import { getProductAttributes } from "@/services/product-attributes";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !canAccessPath(session.role, "/dashboard/admin/products")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const attributes = await getProductAttributes();
    return NextResponse.json(attributes);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load attributes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const parsed = productAttributeFormSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid attribute data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const attribute = await createProductAttributeInDb(parsed.data);
    return NextResponse.json(attribute, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create attribute";
    const status = message.includes("already") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
