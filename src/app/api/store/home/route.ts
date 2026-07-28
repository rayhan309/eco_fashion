import { NextResponse } from "next/server";
import { loadHomePageData } from "@/lib/data/home";

export async function GET() {
  try {
    const data = await loadHomePageData();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load home data";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
