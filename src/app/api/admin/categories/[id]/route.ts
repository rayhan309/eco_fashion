import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canManageProducts } from "@/lib/auth/permissions";
import {
  deleteCategoryInDb,
  findAdminCategoryById,
  updateCategoryInDb,
} from "@/lib/db/category-mutations";
import { adminCategoryFormSchema } from "@/lib/validations/admin-category";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getAdminSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await context.params;
    const category = await findAdminCategoryById(decodeURIComponent(id));
    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }
    return NextResponse.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load category";
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
    const parsed = adminCategoryFormSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid category data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const category = await updateCategoryInDb(decodeURIComponent(id), parsed.data);
    return NextResponse.json(category);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update category";
    const status =
      message === "Category not found" ? 404 : message.includes("already") ? 409 : 500;
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
    await deleteCategoryInDb(decodeURIComponent(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete category";
    const status = message === "Category not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
