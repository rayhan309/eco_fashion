import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canAccessPath } from "@/lib/auth/permissions";
import { sendOrderToSteadfastInDb } from "@/lib/db/order-mutations";

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

export async function POST(_request: Request, context: RouteContext) {
  try {
    if (!(await requireOrdersAccess())) return forbidden();

    const { id } = await context.params;
    const result = await sendOrderToSteadfastInDb(decodeURIComponent(id));
    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send order to Steadfast";
    const status =
      message === "Order not found"
        ? 404
        : message.includes("already sent") ||
            message.includes("disabled") ||
            message.includes("credentials") ||
            message.includes("phone") ||
            message.includes("address")
          ? 400
          : 502;
    return NextResponse.json({ error: message }, { status });
  }
}
