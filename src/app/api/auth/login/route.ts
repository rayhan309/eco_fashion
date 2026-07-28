import { NextResponse } from "next/server";
import {
  ensureSuperAdmin,
  findAdminUserByEmailWithPassword,
  toPublicAdminUser,
} from "@/lib/auth/admin-users";
import { verifyPassword } from "@/lib/auth/password";
import {
  ADMIN_SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/lib/auth/session";
import { ROLE_HOME } from "@/lib/auth/permissions";
import { loginBodySchema } from "@/lib/validations/admin-user";

export async function POST(request: Request) {
  try {
    await ensureSuperAdmin();

    const json = await request.json();
    const parsed = loginBodySchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid credentials", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    const user = await findAdminUserByEmailWithPassword(email);

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const ok = await verifyPassword(parsed.data.password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const publicUser = toPublicAdminUser(user);
    const token = await createSessionToken({
      sub: publicUser.id,
      email: publicUser.email,
      name: publicUser.name,
      role: publicUser.role,
    });

    const response = NextResponse.json({
      user: publicUser,
      redirectTo: ROLE_HOME[publicUser.role],
    });
    response.cookies.set(ADMIN_SESSION_COOKIE, token, sessionCookieOptions());
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
