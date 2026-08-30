import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canAccessPath } from "@/lib/auth/permissions";
import { getAdminOrderHistoryInDb } from "@/lib/db/order-mutations";

type RouteContext = { params: Promise<{ id: string }> };

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

async function requireOrdersAccess() {
  const session = await getAdminSession();
  if (!session || !canAccessPath(session.role, "/dashboard/admin/orders")) {
    return null;
  }
  return session;
}

export async function GET(_request: Request, context: RouteContext) {
  try {
    if (!(await requireOrdersAccess())) return forbidden();

    const { id } = await context.params;
    const history = await getAdminOrderHistoryInDb(decodeURIComponent(id));
    return NextResponse.json(history);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load order history";
    const status = message === "Order not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
