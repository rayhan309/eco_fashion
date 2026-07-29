import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canAccessPath } from "@/lib/auth/permissions";
import {
  deleteAdminOrderInDb,
  getAdminOrderById,
  updateAdminOrderInDb,
} from "@/lib/db/order-mutations";
import { adminOrderUpdateSchema } from "@/lib/validations/admin-order";

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
    const order = await getAdminOrderById(decodeURIComponent(id));
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    if (!(await requireOrdersAccess())) return forbidden();

    const { id } = await context.params;
    const json = await request.json();
    const parsed = adminOrderUpdateSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid order data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const order = await updateAdminOrderInDb(decodeURIComponent(id), parsed.data);
    return NextResponse.json(order);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update order";
    const status = message === "Order not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    if (!(await requireOrdersAccess())) return forbidden();

    const { id } = await context.params;
    await deleteAdminOrderInDb(decodeURIComponent(id));
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete order";
    const status = message === "Order not found" ? 404 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
