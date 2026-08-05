import type { PixelContentItem } from "@/lib/pixel/types";

/** Keep only items with a non-empty content id (TikTok rejects blank content_id). */
export function normalizePixelContents(
  contents?: PixelContentItem[],
  contentIds?: string[],
): PixelContentItem[] {
  const fromContents = (contents ?? [])
    .map((item) => ({
      id: String(item.id ?? "").trim(),
      quantity: Math.max(1, Number(item.quantity) || 1),
      item_price: Number(item.item_price) || 0,
    }))
    .filter((item) => item.id.length > 0);

  if (fromContents.length > 0) return fromContents;

  return (contentIds ?? [])
    .map((id) => String(id ?? "").trim())
    .filter((id) => id.length > 0)
    .map((id) => ({ id, quantity: 1, item_price: 0 }));
}

export function pixelContentIds(contents: PixelContentItem[]): string[] {
  return contents.map((item) => item.id);
}
