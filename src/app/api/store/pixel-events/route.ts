import { NextResponse } from "next/server";
import { dispatchCapiEvent } from "@/lib/pixel/dispatch";
import type { PixelEventName, PixelEventPayload } from "@/lib/pixel/types";

const ALLOWED_EVENTS: PixelEventName[] = [
  "PageView",
  "ViewContent",
  "AddToCart",
  "InitiateCheckout",
  "Purchase",
];

function clientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return request.headers.get("x-real-ip") ?? undefined;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<PixelEventPayload>;
    const eventName = body.eventName;
    const eventId = typeof body.eventId === "string" ? body.eventId.trim() : "";

    if (!eventName || !ALLOWED_EVENTS.includes(eventName) || !eventId) {
      return NextResponse.json({ error: "Invalid event payload" }, { status: 400 });
    }

    const payload: PixelEventPayload = {
      eventName,
      eventId,
      eventSourceUrl: body.eventSourceUrl,
      value: body.value,
      currency: body.currency,
      contentIds: body.contentIds,
      contents: body.contents,
      contentType: body.contentType,
      contentName: body.contentName,
      numItems: body.numItems,
      orderId: body.orderId,
      user: body.user,
      browser: {
        ...body.browser,
        clientIpAddress: clientIp(request),
        clientUserAgent:
          body.browser?.clientUserAgent || request.headers.get("user-agent") || undefined,
      },
    };

    // Fire-and-forget style: await so serverless doesn't freeze early, but don't fail UX.
    await dispatchCapiEvent(payload);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Pixel event failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
