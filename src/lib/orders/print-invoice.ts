import { formatCurrency } from "@/lib/formatters/currency";
import { ADMIN_ORDER_STATUS_LABELS } from "@/types/admin-order";
import type { StoreOrder } from "@/types/store-order";

type PrintShopInfo = {
  shopName: string;
  contactEmail?: string;
  contactPhone?: string;
  contactAddress?: string;
};

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function buildInvoiceHtml(order: StoreOrder, shop: PrintShopInfo): string {
  const placedAt = new Date(order.createdAt).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const rows = order.items
    .map((item) => {
      const line = formatCurrency(item.price * item.quantity, item.currency);
      const unit = formatCurrency(item.price, item.currency);
      return `<tr>
        <td>
          <div style="font-weight:600">${escapeHtml(item.name)}</div>
          <div style="color:#61716a;font-size:12px">${escapeHtml(item.size)} · ${escapeHtml(item.color)}</div>
        </td>
        <td>${item.quantity}</td>
        <td style="text-align:right">${unit}</td>
        <td style="text-align:right;font-weight:600">${line}</td>
      </tr>`;
    })
    .join("");

  const delivery =
    order.shippingFee === 0 ? "Free" : formatCurrency(order.shippingFee, order.currency);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Invoice ${escapeHtml(order.orderNumber)}</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 32px;
      font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
      color: #20312d;
      background: #fff;
    }
    h1 { margin: 0; font-size: 20px; }
    .muted { color: #61716a; font-size: 13px; }
    .header { display: flex; justify-content: space-between; gap: 24px; border-bottom: 1px solid #e5e7eb; padding-bottom: 20px; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-top: 24px; }
    table { width: 100%; border-collapse: collapse; margin-top: 28px; }
    th { text-align: left; font-size: 11px; letter-spacing: 0.06em; text-transform: uppercase; color: #61716a; background: #f6f3ed; padding: 10px 12px; }
    td { padding: 12px; border-top: 1px solid #eee; font-size: 14px; vertical-align: top; }
    .totals { margin-left: auto; width: 260px; margin-top: 20px; font-size: 14px; }
    .totals .row { display: flex; justify-content: space-between; padding: 6px 0; }
    .totals .grand { border-top: 1px solid #e5e7eb; margin-top: 8px; padding-top: 10px; font-weight: 700; font-size: 16px; }
    .footer { margin-top: 40px; text-align: center; color: #61716a; font-size: 12px; }
    @media print {
      body { padding: 0; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${escapeHtml(shop.shopName)}</h1>
      ${shop.contactAddress ? `<div class="muted">${escapeHtml(shop.contactAddress)}</div>` : ""}
      <div class="muted">${[shop.contactPhone, shop.contactEmail].filter(Boolean).map(String).map(escapeHtml).join(" · ")}</div>
    </div>
    <div style="text-align:right">
      <div class="muted" style="font-weight:700;letter-spacing:0.12em">INVOICE</div>
      <div style="font-size:18px;font-weight:700;margin-top:4px">${escapeHtml(order.orderNumber)}</div>
      <div class="muted">${escapeHtml(placedAt)}</div>
      <div style="margin-top:4px;font-weight:600">${escapeHtml(ADMIN_ORDER_STATUS_LABELS[order.status])}</div>
    </div>
  </div>

  <div class="grid">
    <div>
      <div class="muted" style="font-weight:700;letter-spacing:0.08em">BILL TO</div>
      <div style="font-weight:600;margin-top:6px">${escapeHtml(order.customer.name)}</div>
      <div class="muted">${escapeHtml(order.customer.phone)}</div>
      ${order.customer.email ? `<div class="muted">${escapeHtml(order.customer.email)}</div>` : ""}
      <div class="muted" style="margin-top:6px">${escapeHtml(order.customer.address)}<br/>${escapeHtml(order.customer.city)}${order.customer.region ? `, ${escapeHtml(order.customer.region)}` : ""}</div>
    </div>
    <div style="text-align:right">
      <div class="muted" style="font-weight:700;letter-spacing:0.08em">PAYMENT</div>
      <div style="font-weight:600;margin-top:6px">Cash on delivery (COD)</div>
      <div class="muted">${order.itemCount} items</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Item</th>
        <th>Qty</th>
        <th style="text-align:right">Price</th>
        <th style="text-align:right">Total</th>
      </tr>
    </thead>
    <tbody>${rows}</tbody>
  </table>

  <div class="totals">
    <div class="row"><span class="muted">Subtotal</span><span>${formatCurrency(order.subtotal, order.currency)}</span></div>
    <div class="row"><span class="muted">Delivery</span><span>${delivery}</span></div>
    <div class="row grand"><span>Amount due</span><span>${formatCurrency(order.total, order.currency)}</span></div>
  </div>

  <div class="footer">Thank you for shopping with ${escapeHtml(shop.shopName)}.</div>
</body>
</html>`;
}

/** Opens a print dialog for the invoice (no separate page). */
export function printOrderInvoice(order: StoreOrder, shop: PrintShopInfo) {
  const html = buildInvoiceHtml(order, shop);
  const frame = document.createElement("iframe");
  frame.setAttribute("aria-hidden", "true");
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

  frame.onload = () => {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } finally {
      cleanup();
    }
  };

  // Fallback if onload already fired
  window.setTimeout(() => {
    try {
      frame.contentWindow?.focus();
      frame.contentWindow?.print();
    } finally {
      cleanup();
    }
  }, 250);
}
