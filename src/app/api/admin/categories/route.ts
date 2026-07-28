import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canAccessPath } from "@/lib/auth/permissions";
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
