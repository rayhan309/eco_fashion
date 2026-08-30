"use client";

import {
  createEventId,
  getBrowserIds,
  trackBrowserPixel,
} from "@/lib/pixel/browser";
import type { PixelContentItem, PixelEventName } from "@/lib/pixel/types";
import { api } from "@/lib/axios";

type TrackInput = {
  eventName: PixelEventName;
  value?: number;
  currency?: string;
  contentIds?: string[];
  contents?: PixelContentItem[];
  contentType?: string;
  contentName?: string;
  numItems?: number;
  orderId?: string;
  user?: {
    email?: string;
    phone?: string;
    firstName?: string;
    city?: string;
    state?: string;
  };
  /** When set, reuse this id (browser + CAPI dedup). */
  eventId?: string;
  /** Skip posting to our CAPI proxy (e.g. Purchase already sent server-side). */
  skipServer?: boolean;
  /** Skip browser fbq/ttq (e.g. base pixel already called page()). */
  skipBrowser?: boolean;
};

/**
 * Fire browser pixels and (optionally) server CAPI with the same event_id.
 */
export async function trackPixelEvent(input: TrackInput): Promise<string> {
  const eventId = input.eventId ?? createEventId();
  const eventSourceUrl = typeof window !== "undefined" ? window.location.href : undefined;
  const browser = getBrowserIds();

  if (!input.skipBrowser) {
    trackBrowserPixel({
      eventName: input.eventName,
      eventId,
      value: input.value,
      currency: input.currency,
      contentIds: input.contentIds,
      contents: input.contents,
      contentType: input.contentType ?? "product",
      contentName: input.contentName,
      numItems: input.numItems,
      orderId: input.orderId,
    });
  }

  if (!input.skipServer) {
    try {
      await api.post("/api/store/pixel-events", {
        eventName: input.eventName,
        eventId,
        eventSourceUrl,
        value: input.value,
        currency: input.currency,
        contentIds: input.contentIds,
        contents: input.contents,
        contentType: input.contentType ?? "product",
        contentName: input.contentName,
        numItems: input.numItems,
        orderId: input.orderId,
        user: input.user,
        browser,
      });
    } catch {
      /* CAPI failures must not break UX */
    }
  }

  return eventId;
}

export function cartContentsFromItems(
  items: Array<{ productId: string; slug?: string; quantity: number; price: number }>,
): PixelContentItem[] {
  return items
    .map((item) => ({
      id: String(item.productId || item.slug || "").trim(),
      quantity: item.quantity,
      item_price: item.price,
    }))
    .filter((item) => item.id.length > 0);
}
