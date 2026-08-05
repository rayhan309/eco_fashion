import { getSiteSettingsFromDbOrFallback } from "@/lib/db/readers/site-settings";
import { sendMetaCapiEvent } from "@/lib/pixel/meta-capi";
import { sendTikTokCapiEvent } from "@/lib/pixel/tiktok-capi";
import type { PixelEventPayload } from "@/lib/pixel/types";

/** Fire Meta + TikTok CAPI in parallel when enabled. Never throws to callers. */
export async function dispatchCapiEvent(payload: PixelEventPayload): Promise<void> {
  try {
    const settings = await getSiteSettingsFromDbOrFallback();
    await Promise.all([
      sendMetaCapiEvent(settings, payload).catch((error) => {
        console.error("[meta-capi] failed:", error);
      }),
      sendTikTokCapiEvent(settings, payload).catch((error) => {
        console.error("[tiktok-capi] failed:", error);
      }),
    ]);
  } catch (error) {
    console.error("[capi] dispatch failed:", error);
  }
}
