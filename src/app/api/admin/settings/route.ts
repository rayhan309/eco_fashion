import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canManageUsers } from "@/lib/auth/permissions";
import { upsertSiteSettingsInDb } from "@/lib/db/site-settings-mutations";
import { getSiteSettingsFromDbOrFallback } from "@/lib/db/readers/site-settings";
import { revalidateSiteSettingsCache } from "@/lib/site-settings/server-cache";
import type { SiteSettings } from "@/types/site-settings";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !canManageUsers(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const settings = await getSiteSettingsFromDbOrFallback();
    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || !canManageUsers(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = (await request.json()) as Partial<SiteSettings>;
    const settings = await upsertSiteSettingsInDb(json);
    revalidateSiteSettingsCache();
    return NextResponse.json(settings);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
