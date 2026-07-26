"use client";

import {
  Box,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import Link from "next/link";
import type { AdminRecentOrder } from "@/data/dummy/admin-overview";

type RecentOrdersTableProps = {
  orders: AdminRecentOrder[];
};

const statusColor: Record<
  AdminRecentOrder["status"],
  { bg: string; color: string }
> = {
  Processing: { bg: "rgba(230,163,74,0.16)", color: "#9a6418" },
  Shipped: { bg: "rgba(31,111,91,0.12)", color: "#1f6f5b" },
  Delivered: { bg: "rgba(32,49,45,0.08)", color: "#20312d" },
  Cancelled: { bg: "rgba(180,83,9,0.12)", color: "#9a3412" },
};

function formatBdt(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  return (
    <Box
      sx={{
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "#fffdf8",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, sm: 2.5 },
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Recent orders
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: "0.85rem", color: "text.secondary" }}>
            Latest store activity
          </Typography>
        </Box>
        <Typography
          component={Link}
          href="/dashboard/admin/orders"
          sx={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#1f6f5b",
            textDecoration: "none",
            "&:hover": { color: "#185a4a" },
          }}
        >
          View all
        </Typography>
      </Box>

      <Box sx={{ overflowX: "auto" }}>
        <Table size="small" sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow>
              {["Order", "Customer", "Date", "Status", "Total"].map((heading) => (
                <TableCell
                  key={heading}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                    bgcolor: "rgba(246,243,237,0.65)",
                    borderBottomColor: "divider",
                  }}
                >
                  {heading}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => {
              const tone = statusColor[order.status];
              return (
                <TableRow
                  key={order.id}
                  hover
                  sx={{ "&:last-child td": { borderBottom: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 600, color: "text.primary" }}>
                    {order.orderNumber}
                  </TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell sx={{ color: "text.secondary" }}>
                    {formatDate(order.date)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{
                        borderRadius: 1,
                        fontWeight: 600,
                        bgcolor: tone.bg,
                        color: tone.color,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>
                    {formatBdt(order.total)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Box>
  );
}
