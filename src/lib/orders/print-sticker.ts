import { formatCurrency } from "@/lib/formatters/currency";
import type { StoreOrder } from "@/types/store-order";

type PrintShopInfo = {
  shopName: string;
  contactPhone?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

/** Compact courier shipping sticker (approx 100×150mm thermal label). */
export function buildStickerHtml(order: StoreOrder, shop: PrintShopInfo): string {
  const items = order.items
    .map(
      (item) =>
        `${escapeHtml(item.name)} ×${item.quantity}${item.size || item.color ? ` (${escapeHtml([item.size, item.color].filter(Boolean).join(" / "))})` : ""}`,
    )
    .join("<br/>");

  const addressParts = [
    order.customer.address,
    order.customer.deliveryArea,
    order.customer.city,
    order.customer.region,
  ]
    .map((part) => part?.trim())
    .filter(Boolean);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Sticker ${escapeHtml(order.orderNumber)}</title>
  <style>
    * { box-sizing: border-box; }
    @page { size: 100mm 150mm; margin: 4mm; }
    body {
      margin: 0;
      padding: 0;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      color: #111;
      background: #fff;
    }
    .label {
      width: 92mm;
      min-height: 140mm;
      border: 2px solid #111;
      padding: 8px 10px;
    }
    .shop {
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.02em;
      text-transform: uppercase;
      border-bottom: 1px solid #111;
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .row { margin: 6px 0; font-size: 13px; line-height: 1.35; }
    .label-key {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #444;
      margin-bottom: 2px;
    }
    .order-no { font-size: 20px; font-weight: 800; }
    .phone { font-size: 18px; font-weight: 800; }
    .name { font-size: 16px; font-weight: 700; }
    .cod {
      margin-top: 10px;
      border: 2px solid #111;
      padding: 8px;
      text-align: center;
      font-size: 18px;
      font-weight: 800;
    }
    .items { font-size: 12px; }
    .note { font-size: 11px; color: #333; margin-top: 8px; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="label">
    <div class="shop">${escapeHtml(shop.shopName)}${shop.contactPhone ? ` · ${escapeHtml(shop.contactPhone)}` : ""}</div>
    <div class="row">
      <div class="label-key">Order</div>
      <div class="order-no">#${escapeHtml(order.orderNumber)}</div>
    </div>
    <div class="row">
      <div class="label-key">Customer</div>
      <div class="name">${escapeHtml(order.customer.name)}</div>
      <div class="phone">${escapeHtml(order.customer.phone)}</div>
    </div>
    <div class="row">
      <div class="label-key">Address</div>
      <div>${addressParts.map(escapeHtml).join(", ")}</div>
    </div>
    <div class="row items">
      <div class="label-key">Items (${order.itemCount})</div>
      <div>${items || escapeHtml(order.itemsSummary)}</div>
    </div>
    ${
      order.customer.note?.trim()
        ? `<div class="note"><strong>Note:</strong> ${escapeHtml(order.customer.note.trim())}</div>`
        : ""
    }
    <div class="cod">COD: ${formatCurrency(order.total, order.currency)}</div>
  </div>
</body>
</html>`;
}

function printHtmlDocument(html: string, title: string) {
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
  frame.setAttribute("title", title);
  frame.style.position = "fixed";
  frame.style.right = "0";
  frame.style.bottom = "0";
  frame.style.width = "0";
  frame.style.height = "0";
  frame.style.border = "0";
  document.body.appendChild(frame);

  const doc = frame.contentDocument ?? frame.contentWindow?.document;
  if (!doc) {
    document.body.removeChild(frame);
    throw new Error("Could not open print preview");
  }

  doc.open();
  doc.write(html);
  doc.close();

  const cleanup = () => {
    window.setTimeout(() => {
      if (frame.parentNode) frame.parentNode.removeChild(frame);
    }, 500);
  };

  const runPrint = () => {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } finally {
      cleanup();
    }
  };

  frame.onload = runPrint;
  window.setTimeout(runPrint, 250);
}

export function printOrderSticker(order: StoreOrder, shop: PrintShopInfo) {
  printHtmlDocument(buildStickerHtml(order, shop), `Sticker ${order.orderNumber}`);
}
