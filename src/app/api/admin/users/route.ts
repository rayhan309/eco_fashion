import { NextResponse } from "next/server";
import {
  createAdminUserRecord,
  deleteAdminUserById,
  ensureSuperAdmin,
  findAdminUserByEmail,
  findAdminUserById,
  listAdminUsers,
  toPublicAdminUser,
} from "@/lib/auth/admin-users";
import { getAdminSession } from "@/lib/auth/get-session";
import { hashPassword } from "@/lib/auth/password";
import { canManageUsers } from "@/lib/auth/permissions";
import { createAdminUserBodySchema } from "@/lib/validations/admin-user";

async function requireSuperAdmin() {
  const session = await getAdminSession();
  if (!session || !canManageUsers(session.role)) return null;
  return session;
}

export async function GET() {
  try {
    await ensureSuperAdmin();
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const docs = await listAdminUsers();
    return NextResponse.json({ users: docs.map(toPublicAdminUser) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to list users";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await ensureSuperAdmin();
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const parsed = createAdminUserBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const exists = await findAdminUserByEmail(email);
    if (exists) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    const created = await createAdminUserRecord({
      email,
      name: parsed.data.name.trim(),
      role: parsed.data.role,
      passwordHash: await hashPassword(parsed.data.password),
    });

    return NextResponse.json({ user: toPublicAdminUser(created) }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    await ensureSuperAdmin();
    const session = await requireSuperAdmin();
    if (!session) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Invalid user id" }, { status: 400 });
    }

    if (id === session.sub) {
      return NextResponse.json({ error: "You cannot delete your own account" }, { status: 400 });
    }

    const target = await findAdminUserById(id);
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (target.role === "super_admin") {
      return NextResponse.json({ error: "Cannot delete a Super Admin" }, { status: 400 });
    }

    await deleteAdminUserById(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
