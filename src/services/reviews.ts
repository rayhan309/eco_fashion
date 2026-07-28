import { getReviewsFromDbOrFallback } from "@/lib/db/readers/reviews";
import type { ClientReview } from "@/types/review";

export async function getClientReviews(limit = 6): Promise<ClientReview[]> {
  return getReviewsFromDbOrFallback(limit);
}
