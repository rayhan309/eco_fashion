import { NextResponse } from "next/server";
import { SITE_SETTINGS_REVALIDATE_SECONDS } from "@/lib/queries/constants";
import { getCategories } from "@/services/categories";

export async function GET() {
  try {
    const categories = await getCategories();
    return NextResponse.json(categories, {
      headers: {
        "Cache-Control": `public, s-maxage=${SITE_SETTINGS_REVALIDATE_SECONDS}, stale-while-revalidate=60`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load categories";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
