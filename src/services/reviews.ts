import { dummyReviews } from "@/data/dummy/reviews";
import type { ClientReview } from "@/types/review";

/**
 * Reviews service.
 * Today: reads dummy data.
 * Later: replace with a database / API call — keep the same return type.
 */
export async function getClientReviews(limit = 8): Promise<ClientReview[]> {
  return dummyReviews.slice(0, limit);
}
