"use client";

import type { PixelContentItem, PixelEventName } from "@/lib/pixel/types";

type FbqFn = (...args: unknown[]) => void;
type TtqFn = {
  track: (event: string, params?: Record<string, unknown>, options?: { event_id?: string }) => void;
  page: () => void;
  load: (pixelId: string) => void;
};

declare global {
  interface Window {
    fbq?: FbqFn;
    _fbq?: FbqFn;
    ttq?: TtqFn;
  }
}

/** Meta standard event names (Events Manager funnel). */
const META_BROWSER_EVENT: Record<PixelEventName, string> = {
  PageView: "PageView",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "Purchase",
};

/** TikTok standard event names. */
const TIKTOK_BROWSER_EVENT: Record<PixelEventName, string> = {
  PageView: "Pageview",
  ViewContent: "ViewContent",
  AddToCart: "AddToCart",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "CompletePayment",
};

export function createEventId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : undefined;
}

export function getBrowserIds() {
  return {
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
    ttp: readCookie("_ttp"),
    ttclid: readCookie("ttclid"),
    clientUserAgent: typeof navigator !== "undefined" ? navigator.userAgent : undefined,
  };
}

type BrowserTrackInput = {
  eventName: PixelEventName;
  eventId: string;
  value?: number;
  currency?: string;
  contentIds?: string[];
  contents?: PixelContentItem[];
  contentType?: string;
  contentName?: string;
  numItems?: number;
  orderId?: string;
};

function buildParams(input: BrowserTrackInput): Record<string, unknown> {
  const params: Record<string, unknown> = {};
  if (input.currency) params.currency = input.currency;
  if (input.value != null) params.value = input.value;
  if (input.contentIds?.length) params.content_ids = input.contentIds;
  if (input.contents?.length) {
    params.contents = input.contents.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      item_price: item.item_price,
    }));
  }
  if (input.contentType) params.content_type = input.contentType;
  if (input.contentName) params.content_name = input.contentName;
  if (input.numItems != null) params.num_items = input.numItems;
  if (input.orderId) params.order_id = input.orderId;
  return params;
}

function fireOnce(input: BrowserTrackInput): { meta: boolean; tiktok: boolean } {
  const params = buildParams(input);
  let meta = false;
  let tiktok = false;

  try {
    if (typeof window.fbq === "function") {
      window.fbq("track", META_BROWSER_EVENT[input.eventName], params, {
        eventID: input.eventId,
      });
      meta = true;
    }
  } catch {
    /* ignore */
  }

  try {
    if (typeof window.ttq?.track === "function") {
      const ttParams: Record<string, unknown> = { ...params };
      if (input.contents?.length) {
        ttParams.contents = input.contents.map((item) => ({
          content_id: item.id,
          quantity: item.quantity,
          price: item.item_price,
        }));
      }
      window.ttq.track(TIKTOK_BROWSER_EVENT[input.eventName], ttParams, {
        event_id: input.eventId,
      });
      tiktok = true;
    }
  } catch {
    /* ignore */
  }

  return { meta, tiktok };
}

/** Fire Meta + TikTok browser events; retry briefly until stubs are ready. */
export function trackBrowserPixel(input: BrowserTrackInput) {
  if (typeof window === "undefined") return;

  const result = fireOnce(input);
  if (result.meta || result.tiktok) return;

  let tries = 0;
  const timer = window.setInterval(() => {
    tries += 1;
    const again = fireOnce(input);
    if (again.meta || again.tiktok || tries >= 25) {
      window.clearInterval(timer);
    }
  }, 200);
}
