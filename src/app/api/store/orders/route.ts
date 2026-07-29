import { NextResponse } from "next/server";
import { createStoreOrderInDb } from "@/lib/db/order-mutations";
import type { CreateStoreOrderInput } from "@/types/store-order";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateStoreOrderInput;
    const order = await createStoreOrderInDb(body);
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to place order";
    const status = message.includes("required") || message.includes("empty") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
