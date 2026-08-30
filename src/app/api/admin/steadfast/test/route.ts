import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canAccessPath } from "@/lib/auth/permissions";
import { getSiteSettingsFromDbOrFallback } from "@/lib/db/readers/site-settings";
import { steadfastGetBalance } from "@/lib/steadfast/client";
import { assertSteadfastReady, resolveSteadfastConfig } from "@/lib/steadfast/config";

function forbidden() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

type TestBody = {
  baseUrl?: string;
  apiKey?: string;
  secretKey?: string;
  enabled?: boolean;
};

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || !canAccessPath(session.role, "/dashboard/admin/settings/steadfast")) {
      return forbidden();
    }

    const body = (await request.json().catch(() => ({}))) as TestBody;
    const settings = await getSiteSettingsFromDbOrFallback();
    const resolved = resolveSteadfastConfig({
      ...settings,
      steadfastEnabled: body.enabled ?? settings.steadfastEnabled,
      steadfastBaseUrl: body.baseUrl?.trim() || settings.steadfastBaseUrl,
      steadfastApiKey: body.apiKey?.trim() || settings.steadfastApiKey,
      steadfastSecretKey: body.secretKey?.trim() || settings.steadfastSecretKey,
    });

    assertSteadfastReady(resolved);

    const balance = await steadfastGetBalance({
      baseUrl: resolved.baseUrl,
      apiKey: resolved.apiKey,
      secretKey: resolved.secretKey,
    });

    return NextResponse.json({
      ok: true,
      balance,
      message: `Connection successful. Current balance: ৳${balance.toLocaleString("en-BD")}.`,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Steadfast connection test failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
