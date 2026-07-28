"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import type { AdminRecentOrder } from "@/data/dummy/admin-overview";

type RecentOrdersCardProps = {
  orders: AdminRecentOrder[];
};

function formatBdt(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

export function RecentOrdersCard({ orders }: RecentOrdersCardProps) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.06)",
        bgcolor: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2.5,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderBottom: orders.length > 0 ? "1px solid" : "none",
          borderColor: "rgba(0,0,0,0.06)",
        }}
      >
        <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>Recent orders</Typography>
        <Typography
          component={Link}
          href="/dashboard/admin/orders"
          sx={{
            fontSize: "0.8rem",
            fontWeight: 600,
            color: "#1f6f5b",
            textDecoration: "none",
            "&:hover": { color: "#185a4a" },
          }}
        >
          View all
        </Typography>
      </Box>

      {orders.length === 0 ? (
        <Box
          sx={{
            mx: 2,
            mb: 2,
            mt: 0.5,
            py: 4,
            px: 2,
            borderRadius: 1.5,
            bgcolor: "#f8fafc",
            border: "1px dashed",
            borderColor: "rgba(0,0,0,0.08)",
            textAlign: "center",
          }}
        >
          <Typography sx={{ fontSize: "0.875rem", color: "text.secondary" }}>
            No orders yet. They will appear here after checkout.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ px: 2.5, py: 1 }}>
          {orders.map((order) => (
            <Box
              key={order.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                py: 1.25,
                borderBottom: "1px solid",
                borderColor: "rgba(0,0,0,0.05)",
                "&:last-child": { borderBottom: 0 },
              }}
            >
              <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                  {order.orderNumber}
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                  {order.customer}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 700 }}>
                {formatBdt(order.total)}
              </Typography>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}
