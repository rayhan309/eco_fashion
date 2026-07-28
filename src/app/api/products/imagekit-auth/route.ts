import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canManageProducts } from "@/lib/auth/permissions";
import { getImageKit } from "@/lib/imagekit/server";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const imageKit = getImageKit();
    const authenticationParameters = imageKit.getAuthenticationParameters();
    return NextResponse.json(authenticationParameters);
  } catch (error) {
    const message = error instanceof Error ? error.message : "ImageKit auth failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
