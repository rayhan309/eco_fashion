import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canManageUsers } from "@/lib/auth/permissions";
import { seedDummyData } from "@/lib/seed/seed-dummy-data";

export async function POST() {
  try {
    const session = await getAdminSession();
    if (!session || !canManageUsers(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const results = await seedDummyData();
    const total = results.reduce((sum, row) => sum + row.upserted, 0);

    return NextResponse.json({
      ok: true,
      message: "Dummy data seeded to MongoDB",
      total,
      results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
