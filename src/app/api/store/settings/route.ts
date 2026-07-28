import { NextResponse } from "next/server";
import { SITE_SETTINGS_REVALIDATE_SECONDS } from "@/lib/queries/constants";
import { getPublicSiteSettings } from "@/services/site-settings";

export async function GET() {
  try {
    const settings = await getPublicSiteSettings();
    return NextResponse.json(settings, {
      headers: {
        "Cache-Control": `public, s-maxage=${SITE_SETTINGS_REVALIDATE_SECONDS}, stale-while-revalidate=60`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load settings";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
