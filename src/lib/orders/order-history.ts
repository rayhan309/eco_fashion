import type { AdminOrderStatus } from "@/types/admin-order";

export function formatOrderHistoryTimestamp(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function formatCompactCurrency(amount: number) {
  return `${Math.round(amount).toLocaleString("en-BD")}৳`;
}

const STATUS_CHIP: Record<
  AdminOrderStatus,
  { label?: string; bgcolor: string; color: string }
> = {
  new_order: { label: "New", bgcolor: "#ecfdf5", color: "#047857" },
  order_confirmed: { bgcolor: "#ecfdf5", color: "#047857" },
  entered_steadfast: { bgcolor: "#eff6ff", color: "#1d4ed8" },
  no_response: { bgcolor: "#f8fafc", color: "#475569" },
  will_inform_later: { bgcolor: "#fffbeb", color: "#b45309" },
  follow_up_needed: { bgcolor: "#fef3c7", color: "#92400e" },
  out_for_delivery: { bgcolor: "#ecfeff", color: "#0e7490" },
  scammer_fraudulent: { bgcolor: "#fef2f2", color: "#b91c1c" },
  delivered: { bgcolor: "#f1f5f9", color: "#334155" },
  cancelled: { bgcolor: "#fef2f2", color: "#991b1b" },
};

export function orderStatusChip(status: AdminOrderStatus, statusLabel: string) {
  const preset = STATUS_CHIP[status];
  return {
    label: preset.label ?? statusLabel,
    bgcolor: preset.bgcolor,
    color: preset.color,
  };
}
