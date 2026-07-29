import { dbConnect } from "@/lib/dbConnect";
import { getSeedModel } from "@/lib/seed/seed-model";
import type { ClientReview } from "@/types/review";

function mapReviewDoc(doc: Record<string, unknown>): ClientReview {
  return {
    id: String(doc.legacyId ?? doc.id ?? ""),
    name: String(doc.name ?? ""),
    role: String(doc.role ?? ""),
    location: String(doc.location ?? ""),
    rating: Number(doc.rating ?? 0),
    comment: String(doc.comment ?? ""),
    avatar: String(doc.avatar ?? ""),
    productTitle: String(doc.productTitle ?? ""),
  };
}

export async function readReviewsFromDb(): Promise<ClientReview[]> {
  await dbConnect();
  const Model = getSeedModel("reviews");
  const docs = await Model.find({}).sort({ rating: -1 }).lean();
  return docs.map((doc) => mapReviewDoc(doc as unknown as Record<string, unknown>));
}

export async function getReviewsFromDbOrFallback(limit: number): Promise<ClientReview[]> {
  try {
    const rows = await readReviewsFromDb();
    return rows.slice(0, limit);
  } catch (error) {
    console.error("[db] reviews read failed:", error);
    return [];
  }
}
