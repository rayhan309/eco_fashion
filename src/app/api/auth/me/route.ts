import { NextResponse } from "next/server";
import { ensureSuperAdmin } from "@/lib/auth/admin-users";
import { getAdminSession } from "@/lib/auth/get-session";

export async function GET() {
  try {
    await ensureSuperAdmin();
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: session.sub,
        email: session.email,
        name: session.name,
        role: session.role,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load session";
    return NextResponse.json({ error: message, user: null }, { status: 500 });
  }
}
