"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import HistoryOutlinedIcon from "@mui/icons-material/HistoryOutlined";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import {
  formatCompactCurrency,
  formatOrderHistoryTimestamp,
  orderStatusChip,
} from "@/lib/orders/order-history";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchAdminOrderHistory } from "@/services/admin-order-mutations";
import type { CourierStats, SiteOrderHistoryItem } from "@/types/order-history";

const ORANGE = "#ea580c";

type AdminOrderHistoryDialogProps = {
  orderId: string | null;
  onClose: () => void;
};

function SummaryPill({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.08)",
        borderRadius: 1.5,
        px: 1.5,
        py: 1.25,
        bgcolor: "#fff",
      }}
    >
      <Typography sx={{ fontSize: "0.68rem", color: "text.secondary", mb: 0.35 }}>{label}</Typography>
      <Typography
        sx={{
          fontSize: "0.95rem",
          fontWeight: 700,
          color: accent ? ORANGE : "text.primary",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
}

function StatBox({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "default" | "success" | "danger";
}) {
  const color =
    tone === "success" ? "#15803d" : tone === "danger" ? "#dc2626" : "text.primary";

  return (
    <Box
      sx={{
        flex: 1,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.06)",
        borderRadius: 1.25,
        px: 1.25,
        py: 1,
        bgcolor: "#fafafa",
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontSize: "0.68rem", color: "text.secondary", mb: 0.35 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "1.1rem", fontWeight: 700, color }}>{value}</Typography>
    </Box>
  );
}

function CourierCard({
  title,
  stats,
}: {
  title: string;
  stats: CourierStats;
}) {
  return (
    <Box
      sx={{
        flex: 1,
        minWidth: 0,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.08)",
        borderRadius: 2,
        p: 1.75,
        bgcolor: "#fff",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, mb: 0.5 }}>
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>{title}</Typography>
        {stats.available ? (
          <Chip
            size="small"
            label={`${stats.successRate}% success`}
            sx={{
              height: 24,
              fontWeight: 700,
              fontSize: "0.68rem",
              bgcolor: stats.successRate >= 60 ? "#ecfdf5" : "#fef2f2",
              color: stats.successRate >= 60 ? "#047857" : "#b91c1c",
            }}
          />
        ) : null}
      </Box>

      <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", mb: 1.25 }}>
        Live courier API data
      </Typography>

      {stats.available ? (
        <>
          <Box sx={{ display: "flex", gap: 1, mb: 1.25 }}>
            <StatBox label="Total" value={stats.total} />
            <StatBox label="Delivered" value={stats.delivered} tone="success" />
            <StatBox label="Cancelled" value={stats.cancelled} tone="danger" />
          </Box>
          <Typography sx={{ fontSize: "0.72rem", color: "text.secondary" }}>
            Rating: {stats.rating} · Risk: {stats.risk}
          </Typography>
        </>
      ) : (
        <Alert severity="info" sx={{ borderRadius: 1.25, fontSize: "0.8rem" }}>
          {stats.error ?? "Courier data unavailable."}
        </Alert>
      )}
    </Box>
  );
}

function SiteOrderCard({ order }: { order: SiteOrderHistoryItem }) {
  const chip = orderStatusChip(order.status, order.statusLabel);

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: order.isCurrent ? ORANGE : "rgba(0,0,0,0.08)",
        borderRadius: 2,
        p: 1.75,
        bgcolor: order.isCurrent ? "rgba(234, 88, 12, 0.03)" : "#fff",
      }}
    >
      <Box sx={{ display: "flex", gap: 2, justifyContent: "space-between" }}>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mb: 0.75 }}>
            <Typography sx={{ fontWeight: 700, fontSize: "0.92rem" }}>{order.itemsSummary}</Typography>
            <Chip
              size="small"
              label={chip.label}
              sx={{
                height: 22,
                fontSize: "0.65rem",
                fontWeight: 700,
                bgcolor: chip.bgcolor,
                color: chip.color,
              }}
            />
            {order.isCurrent ? (
              <Chip
                size="small"
                label="This order"
                sx={{
                  height: 22,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  bgcolor: "#ffedd5",
                  color: ORANGE,
                }}
              />
            ) : null}
          </Box>

          {order.address ? (
            <Typography sx={{ fontSize: "0.78rem", color: "text.secondary", mb: 0.5 }}>
              {order.address}
            </Typography>
          ) : null}

          <Typography sx={{ fontSize: "0.78rem", color: "text.secondary" }}>
            #{order.orderNumber} · {formatOrderHistoryTimestamp(order.createdAt)}
          </Typography>
        </Box>

        <Box sx={{ textAlign: "right", flexShrink: 0 }}>
          <Typography sx={{ fontWeight: 700, fontSize: "1rem", color: ORANGE }}>
            {formatCompactCurrency(order.total)}
          </Typography>
          <Typography sx={{ fontSize: "0.72rem", color: "text.secondary", mt: 0.25 }}>
            {formatCompactCurrency(order.subtotal)} + {formatCompactCurrency(order.shippingFee)} delivery
          </Typography>
        </Box>
      </Box>

      <Typography
        sx={{
          mt: 1.25,
          fontSize: "0.72rem",
          color: "text.secondary",
          bgcolor: "#f8fafc",
          borderRadius: 1,
          px: 1,
          py: 0.75,
        }}
      >
        {order.shipmentNote}
      </Typography>
    </Box>
  );
}

export function AdminOrderHistoryDialog({ orderId, onClose }: AdminOrderHistoryDialogProps) {
  const open = Boolean(orderId);

  const { data, isPending, isError, error } = useQuery({
    queryKey: [...queryKeys.admin.order(orderId ?? ""), "history"],
    queryFn: () => fetchAdminOrderHistory(orderId!),
    enabled: open && Boolean(orderId),
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      slotProps={{
        paper: { sx: { borderRadius: 2.5 } },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
          pb: 1,
        }}
      >
        <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start" }}>
          <HistoryOutlinedIcon sx={{ color: ORANGE, mt: 0.25 }} />
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: "1.15rem" }}>Courier History</Typography>
            {data ? (
              <Typography sx={{ mt: 0.25, fontSize: "0.82rem", color: "text.secondary" }}>
                {data.customerName} · {data.customerPhone}
              </Typography>
            ) : null}
          </Box>
        </Box>
        <IconButton aria-label="Close" onClick={onClose} sx={{ border: "1px solid", borderColor: "divider" }}>
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ py: 2.5, bgcolor: "#fcfcfc" }}>
        {isPending ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress size={28} sx={{ color: ORANGE }} />
          </Box>
        ) : isError || !data ? (
          <Typography color="error">
            {error instanceof Error ? error.message : "Failed to load courier history"}
          </Typography>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.25 }}>
              <SummaryPill label="Customer" value={data.customerName} />
              <SummaryPill label={`${data.shopLabel} Orders`} value={String(data.siteOrderCount)} />
              <SummaryPill
                label={`${data.shopLabel} Shipments`}
                value={String(data.siteShipmentCount)}
                accent
              />
            </Box>

            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 1.5 }}>
              <CourierCard title="Pathao Courier" stats={data.pathaoStats} />
              <CourierCard title="Steadfast Courier" stats={data.steadfastStats} />
            </Box>

            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: "0.95rem", mb: 1.25 }}>
                {data.shopLabel} Order History
              </Typography>
              {data.siteOrders.length === 0 ? (
                <Typography sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                  No orders found for this phone number.
                </Typography>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.25 }}>
                  {data.siteOrders.map((order) => (
                    <SiteOrderCard key={order.id} order={order} />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
