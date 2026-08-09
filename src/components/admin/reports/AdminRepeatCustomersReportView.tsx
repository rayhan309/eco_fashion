"use client";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { AdminOrderDetailDialog } from "@/components/admin/orders/AdminOrderDetailDialog";
import { AdminOrderEditDialog } from "@/components/admin/orders/AdminOrderEditDialog";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import {
  ADMIN_ORDER_STATUS_LABELS,
  type AdminOrder,
  type AdminOrderStatus,
} from "@/types/admin-order";

const PAGE_SIZE = 12;

const statusChipSx: Record<
  AdminOrderStatus,
  { bgcolor: string; color: string; border: string }
> = {
  new_order: { bgcolor: "#ecfdf5", color: "#047857", border: "#a7f3d0" },
  order_confirmed: { bgcolor: "#eff6ff", color: "#1d4ed8", border: "#bfdbfe" },
  entered_steadfast: { bgcolor: "#f0fdf4", color: "#15803d", border: "#bbf7d0" },
  no_response: { bgcolor: "#f8fafc", color: "#475569", border: "#e2e8f0" },
  will_inform_later: { bgcolor: "#fffbeb", color: "#b45309", border: "#fde68a" },
  follow_up_needed: { bgcolor: "#fef3c7", color: "#92400e", border: "#fcd34d" },
  out_for_delivery: { bgcolor: "#ecfeff", color: "#0e7490", border: "#a5f3fc" },
  scammer_fraudulent: { bgcolor: "#fef2f2", color: "#b91c1c", border: "#fecaca" },
  delivered: { bgcolor: "#f1f5f9", color: "#334155", border: "#e2e8f0" },
  cancelled: { bgcolor: "#fef2f2", color: "#991b1b", border: "#fecaca" },
};

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "").replace(/^880/, "0");
}

function formatBdt(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

function formatOrderDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
}: {
  label: string;
  value: string;
  sublabel?: string;
  icon: typeof PeopleOutlineOutlinedIcon;
}) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.06)",
        bgcolor: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        p: 2.25,
        position: "relative",
      }}
    >
      <Icon
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          fontSize: 22,
          color: "text.disabled",
        }}
      />
      <Typography
        sx={{
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          color: "text.secondary",
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          mt: 1,
          fontSize: "1.5rem",
          fontWeight: 700,
          letterSpacing: "-0.02em",
          lineHeight: 1.2,
        }}
      >
        {value}
      </Typography>
      {sublabel ? (
        <Typography sx={{ mt: 0.5, fontSize: "0.8rem", color: "text.secondary" }}>
          {sublabel}
        </Typography>
      ) : null}
    </Box>
  );
}

type AdminRepeatCustomersReportViewProps = {
  orders: AdminOrder[];
};

export function AdminRepeatCustomersReportView({
  orders,
}: AdminRepeatCustomersReportViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneFilter = normalizePhone(searchParams.get("phone") ?? "");

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewOrderId, setViewOrderId] = useState<string | null>(null);
  const [editOrderId, setEditOrderId] = useState<string | null>(null);

  const { repeatPhones, repeatOrders, stats } = useMemo(() => {
    const counts = new Map<string, number>();
    for (const order of orders) {
      const phone = normalizePhone(order.customerPhone);
      if (!phone) continue;
      counts.set(phone, (counts.get(phone) ?? 0) + 1);
    }

    const repeats = new Set<string>();
    for (const [phone, count] of counts) {
      if (count > 1) repeats.add(phone);
    }

    const filtered = orders.filter((order) =>
      repeats.has(normalizePhone(order.customerPhone)),
    );

    const revenue = filtered.reduce((sum, order) => sum + order.total, 0);

    return {
      repeatPhones: repeats,
      repeatOrders: filtered,
      stats: {
        customers: repeats.size,
        orders: filtered.length,
        revenue,
      },
    };
  }, [orders]);

  const focusedCustomerName = useMemo(() => {
    if (!phoneFilter) return null;
    const match = orders.find(
      (order) => normalizePhone(order.customerPhone) === phoneFilter,
    );
    return match?.customerName ?? null;
  }, [phoneFilter, orders]);

  const filtered = useMemo(() => {
    let list = phoneFilter
      ? orders.filter(
          (order) => normalizePhone(order.customerPhone) === phoneFilter,
        )
      : repeatOrders;
    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (order) =>
        order.orderNumber.toLowerCase().includes(q) ||
        order.customerName.toLowerCase().includes(q) ||
        order.customerPhone.includes(q.replace(/\s/g, "")),
    );
  }, [orders, repeatOrders, phoneFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageOrders = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  function clearPhoneFilter() {
    router.replace("/dashboard/admin/reports/repeat-customers");
    setPage(1);
  }

  const headerCellSx = {
    fontSize: "0.65rem",
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "text.secondary",
    borderBottom: "1px solid",
    borderColor: "divider",
    py: 1.25,
    whiteSpace: "nowrap" as const,
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          alignItems: { md: "flex-start" },
          justifyContent: "space-between",
          gap: 2,
          mb: 2.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: ADMIN_ACCENT,
            }}
          >
            Reports
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: { xs: "1.35rem", sm: "1.5rem" },
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Repeat Customer Report
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "0.9rem", color: "text.secondary" }}>
            {phoneFilter && focusedCustomerName
              ? `Orders for ${focusedCustomerName}`
              : phoneFilter
                ? "No matching repeat customer for this phone."
                : "Customers with more than one order across your store."}
          </Typography>
          <Button
            component={Link}
            href="/dashboard/admin/orders"
            startIcon={<ArrowBackRoundedIcon sx={{ fontSize: 18 }} />}
            sx={{
              mt: 1,
              px: 0,
              minWidth: 0,
              textTransform: "none",
              fontWeight: 600,
              color: ADMIN_ACCENT,
              "&:hover": { bgcolor: "transparent", textDecoration: "underline" },
            }}
          >
            Back to Orders
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(3, minmax(0, 1fr))",
          },
          gap: 1.5,
          mb: 2.5,
        }}
      >
        <StatCard
          label="Repeat customers"
          value={String(stats.customers)}
          sublabel="Phones with 2+ orders"
          icon={PeopleOutlineOutlinedIcon}
        />
        <StatCard
          label="Their orders"
          value={String(stats.orders)}
          sublabel="All repeat-customer orders"
          icon={ShoppingBagOutlinedIcon}
        />
        <StatCard
          label="Revenue"
          value={formatBdt(stats.revenue)}
          sublabel="From repeat customers"
          icon={TrendingUpRoundedIcon}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1.25,
          alignItems: "center",
          mb: 2,
        }}
      >
        <TextField
          size="small"
          placeholder="Search by order ID, name, or phone…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ flex: "1 1 260px", minWidth: 200, maxWidth: 480 }}
        />
        {phoneFilter ? (
          <Chip
            label={`Phone: ${phoneFilter}`}
            onDelete={clearPhoneFilter}
            size="small"
            sx={{
              fontWeight: 600,
              bgcolor: "#fef2f2",
              color: "#dc2626",
              border: "1px solid #fecaca",
              "& .MuiChip-deleteIcon": { color: "#dc2626" },
            }}
          />
        ) : null}
        <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", ml: "auto" }}>
          {filtered.length} order{filtered.length === 1 ? "" : "s"}
        </Typography>
      </Box>

      <TableContainer
        sx={{
          borderRadius: 2,
          border: "1px solid",
          borderColor: "rgba(0,0,0,0.06)",
          bgcolor: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        }}
      >
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "#fafafa" }}>
              {["Order", "Customer", "Total", "Status", "Courier ID", "Date", "View"].map(
                (label) => (
                  <TableCell key={label} sx={headerCellSx}>
                    {label}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 7, textAlign: "center" }}>
                  <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                    {repeatPhones.size === 0
                      ? "No repeat customers yet. When someone places a second order, they’ll show up here."
                      : phoneFilter
                        ? "No orders for this phone among repeat customers."
                        : "No orders match your search."}
                  </Typography>
                  {phoneFilter ? (
                    <Button
                      onClick={clearPhoneFilter}
                      sx={{ mt: 1.5, textTransform: "none", color: ADMIN_ACCENT }}
                    >
                      Show all repeat customers
                    </Button>
                  ) : null}
                </TableCell>
              </TableRow>
            ) : (
              pageOrders.map((order) => {
                const chip = statusChipSx[order.status];
                return (
                  <TableRow key={order.id} hover>
                    <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                      #{order.orderNumber}
                    </TableCell>
                    <TableCell sx={{ minWidth: 200 }}>
                      <Box
                        sx={{
                          display: "flex",
                          flexWrap: "wrap",
                          alignItems: "center",
                          gap: 0.75,
                        }}
                      >
                        <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                          {order.customerName}
                        </Typography>
                        <Box
                          component="span"
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 0.9,
                            py: 0.15,
                            borderRadius: 999,
                            border: "1px solid #f87171",
                            bgcolor: "#fef2f2",
                            color: "#dc2626",
                            fontSize: "0.65rem",
                            fontWeight: 600,
                            lineHeight: 1.4,
                            whiteSpace: "nowrap",
                          }}
                        >
                          Repeat customer
                        </Box>
                      </Box>
                      <Typography
                        sx={{ mt: 0.35, fontSize: "0.8rem", color: "text.secondary" }}
                      >
                        {order.customerPhone}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                      {formatBdt(order.total)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={ADMIN_ORDER_STATUS_LABELS[order.status]}
                        size="small"
                        sx={{
                          borderRadius: 1,
                          fontWeight: 600,
                          fontSize: "0.7rem",
                          bgcolor: chip.bgcolor,
                          color: chip.color,
                          border: `1px solid ${chip.border}`,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 1,
                          py: 0.25,
                          borderRadius: 999,
                          bgcolor: "#f1f5f9",
                          color: "#64748b",
                          fontSize: "0.7rem",
                          fontWeight: 600,
                          border: "1px solid #e2e8f0",
                        }}
                      >
                        No CN
                      </Box>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap", color: "text.secondary" }}>
                      {formatOrderDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View order">
                        <IconButton
                          size="small"
                          aria-label="View order"
                          onClick={() => setViewOrderId(order.id)}
                          sx={{
                            border: "1px solid",
                            borderColor: "rgba(0,0,0,0.08)",
                            bgcolor: "#fff",
                          }}
                        >
                          <VisibilityOutlinedIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {filtered.length > PAGE_SIZE ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 1,
            mt: 2,
          }}
        >
          <Button
            size="small"
            disabled={currentPage <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            sx={{ textTransform: "none" }}
          >
            Previous
          </Button>
          <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
            Page {currentPage} of {totalPages}
          </Typography>
          <Button
            size="small"
            disabled={currentPage >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            sx={{ textTransform: "none" }}
          >
            Next
          </Button>
        </Box>
      ) : null}

      <AdminOrderDetailDialog
        orderId={viewOrderId}
        onClose={() => setViewOrderId(null)}
        onEdit={(id) => {
          setViewOrderId(null);
          setEditOrderId(id);
        }}
      />
      <AdminOrderEditDialog
        orderId={editOrderId}
        onClose={() => setEditOrderId(null)}
      />
    </Box>
  );
}
