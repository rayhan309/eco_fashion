import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/get-session";
import { canAccessPath, canManageProducts } from "@/lib/auth/permissions";
import { createCollectionInDb } from "@/lib/db/collection-mutations";
import { collectionFormSchema } from "@/lib/validations/collection";
import { getCollections } from "@/services/collections";

export async function GET() {
  try {
    const session = await getAdminSession();
    if (!session || !canAccessPath(session.role, "/dashboard/admin/collections")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const collections = await getCollections();
    return NextResponse.json(collections);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load collections";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAdminSession();
    if (!session || !canManageProducts(session.role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const json = await request.json();
    const parsed = collectionFormSchema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid collection data", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const collection = await createCollectionInDb(parsed.data);
    return NextResponse.json(collection, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create collection";
    const status = message.includes("already") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
