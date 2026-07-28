import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canAccessPath } from "@/lib/auth/permissions";
import { getAdminOrders } from "@/services/admin-orders";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !canAccessPath(session.role, "/dashboard/admin/orders")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const orders = await getAdminOrders();
    return NextResponse.json(orders);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
