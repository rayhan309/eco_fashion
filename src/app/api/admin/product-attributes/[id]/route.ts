import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canManageProducts } from "@/lib/auth/permissions";
import {
  deleteProductAttributeInDb,
  findProductAttributeById,
  updateProductAttributeInDb,
} from "@/lib/db/product-attribute-mutations";
import { productAttributeFormSchema } from "@/lib/validations/product-attribute";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const attribute = await findProductAttributeById(id);
    if (!attribute) {
      return NextResponse.json({ error: "Attribute not found" }, { status: 404 });
    }

    return NextResponse.json(attribute);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load attribute";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const json = await request.json();
    const parsed = productAttributeFormSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid attribute data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const attribute = await updateProductAttributeInDb(id, parsed.data);
    return NextResponse.json(attribute);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update attribute";
    const status =
      message === "Attribute not found" ? 404 : message.includes("already") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    await deleteProductAttributeInDb(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete attribute";
    const status = message === "Attribute not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
