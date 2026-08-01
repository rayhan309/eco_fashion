import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canAccessPath, canManageProducts } from "@/lib/auth/permissions";
import {
  createCategoryInDb,
  reorderCategoriesInDb,
} from "@/lib/db/category-mutations";
import {
  adminCategoryFormSchema,
  adminCategoryReorderSchema,
} from "@/lib/validations/admin-category";
import { getAdminCategories } from "@/services/admin-categories";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !canAccessPath(session.role, "/dashboard/admin/categories")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const categories = await getAdminCategories();
    return NextResponse.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load categories";
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
    const parsed = adminCategoryFormSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid category data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const category = await createCategoryInDb(parsed.data);
    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create category";
    const status = message.includes("already") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const parsed = adminCategoryReorderSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid reorder payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const categories = await reorderCategoriesInDb(parsed.data.orderedIds);
    return NextResponse.json(categories);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to reorder categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
