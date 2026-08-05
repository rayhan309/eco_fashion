import { NextResponse } from "next/server";
import { createStoreOrderInDb } from "@/lib/db/order-mutations";
import { dispatchCapiEvent } from "@/lib/pixel/dispatch";
import type { CreateStoreOrderInput } from "@/types/store-order";

function clientIp(request: Request): string | undefined {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim();
  return request.headers.get("x-real-ip") ?? undefined;
}

function splitName(fullName: string): { firstName?: string; lastName?: string } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return {};
  if (parts.length === 1) return { firstName: parts[0] };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateStoreOrderInput;
    const order = await createStoreOrderInDb(body);

    const tracking = body.tracking;
    const eventId =
      tracking?.eventId?.trim() ||
      `purchase_${order.orderNumber}_${Date.now()}`;

    const { firstName, lastName } = splitName(order.customer.name);

    // Server-side Purchase CAPI (browser fires with same eventId after response).
    void dispatchCapiEvent({
      eventName: "Purchase",
      eventId,
      eventSourceUrl: tracking?.eventSourceUrl,
      value: order.total,
      currency: order.currency,
      contentIds: order.items.map((item) => item.productId),
      contents: order.items.map((item) => ({
        id: item.productId,
        quantity: item.quantity,
        item_price: item.price,
      })),
      contentType: "product",
      numItems: order.itemCount,
      orderId: order.orderNumber,
      user: {
        email: order.customer.email || undefined,
        phone: order.customer.phone || undefined,
        firstName,
        lastName,
        city: order.customer.city || undefined,
        state: order.customer.region || undefined,
        country: "bd",
      },
      browser: {
        fbp: tracking?.fbp,
        fbc: tracking?.fbc,
        ttp: tracking?.ttp,
        ttclid: tracking?.ttclid,
        clientUserAgent:
          tracking?.clientUserAgent || request.headers.get("user-agent") || undefined,
        clientIpAddress: clientIp(request),
      },
    });

    return NextResponse.json({ ...order, purchaseEventId: eventId }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to place order";
    const status = message.includes("required") || message.includes("empty") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
