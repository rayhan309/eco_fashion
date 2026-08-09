"use client";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
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
import { useMemo, useState } from "react";
import { ADMIN_ACCENT } from "@/lib/constants/admin";
import type { AdminOrder } from "@/types/admin-order";

const PAGE_SIZE = 12;

type CustomerReportRow = {
  phone: string;
  name: string;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string;
  isRepeat: boolean;
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

function buildCustomerRows(orders: AdminOrder[]): CustomerReportRow[] {
  const byPhone = new Map<
    string,
    {
      phone: string;
      name: string;
      orderCount: number;
      totalSpent: number;
      lastOrderAt: string;
    }
  >();

  for (const order of orders) {
    const phone = normalizePhone(order.customerPhone);
    if (!phone) continue;
    const existing = byPhone.get(phone);
    if (!existing) {
      byPhone.set(phone, {
        phone: order.customerPhone,
        name: order.customerName,
        orderCount: 1,
        totalSpent: order.total,
        lastOrderAt: order.createdAt,
      });
      continue;
    }
    existing.orderCount += 1;
    existing.totalSpent += order.total;
    if (new Date(order.createdAt).getTime() > new Date(existing.lastOrderAt).getTime()) {
      existing.lastOrderAt = order.createdAt;
      existing.name = order.customerName || existing.name;
      existing.phone = order.customerPhone || existing.phone;
    }
  }

  return Array.from(byPhone.values())
    .map((row) => ({
      ...row,
      isRepeat: row.orderCount > 1,
    }))
    .sort(
      (a, b) =>
        new Date(b.lastOrderAt).getTime() - new Date(a.lastOrderAt).getTime(),
    );
}

type AdminCustomersReportViewProps = {
  orders: AdminOrder[];
};

export function AdminCustomersReportView({ orders }: AdminCustomersReportViewProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<"all" | "repeat" | "new">("all");

  const customers = useMemo(() => buildCustomerRows(orders), [orders]);

  const stats = useMemo(() => {
    const repeatCustomers = customers.filter((c) => c.isRepeat).length;
    const lifetimeValue = customers.reduce((sum, c) => sum + c.totalSpent, 0);
    return {
      totalCustomers: customers.length,
      repeatCustomers,
      lifetimeValue,
    };
  }, [customers]);

  const filtered = useMemo(() => {
    let list = customers;
    if (filter === "repeat") list = list.filter((c) => c.isRepeat);
    if (filter === "new") list = list.filter((c) => !c.isRepeat);

    const q = search.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q.replace(/\s/g, "")) ||
        normalizePhone(c.phone).includes(q.replace(/\D/g, "")),
    );
  }, [customers, filter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

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

  const filterChips: { id: "all" | "repeat" | "new"; label: string }[] = [
    { id: "all", label: "All" },
    { id: "repeat", label: "Repeat" },
    { id: "new", label: "New" },
  ];

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
            Customer Report
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "0.9rem", color: "text.secondary" }}>
            All customers aggregated from live orders — spend, frequency, and last purchase.
          </Typography>
        </Box>
        <Button
          component={Link}
          href="/dashboard/admin/reports/repeat-customers"
          variant="outlined"
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderColor: "rgba(0,0,0,0.12)",
            color: "text.primary",
            height: 40,
            flexShrink: 0,
          }}
        >
          Repeat customers
        </Button>
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
          label="Total customers"
          value={String(stats.totalCustomers)}
          icon={PeopleOutlineOutlinedIcon}
        />
        <StatCard
          label="Repeat customers"
          value={String(stats.repeatCustomers)}
          sublabel="More than one order"
          icon={AutorenewRoundedIcon}
        />
        <StatCard
          label="Lifetime value"
          value={formatBdt(stats.lifetimeValue)}
          icon={AccountBalanceWalletOutlinedIcon}
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
          placeholder="Search by name or phone…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          sx={{ flex: "1 1 260px", minWidth: 200, maxWidth: 420 }}
        />
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {filterChips.map((chip) => {
            const active = filter === chip.id;
            return (
              <Chip
                key={chip.id}
                label={chip.label}
                onClick={() => {
                  setFilter(chip.id);
                  setPage(1);
                }}
                sx={{
                  fontWeight: 600,
                  fontSize: "0.8rem",
                  bgcolor: active ? ADMIN_ACCENT : "#fff",
                  color: active ? "#fff" : "text.primary",
                  border: active ? "none" : "1px solid rgba(0,0,0,0.12)",
                  "&:hover": {
                    bgcolor: active ? ADMIN_ACCENT : "#f8fafc",
                  },
                }}
              />
            );
          })}
        </Box>
        <Typography sx={{ fontSize: "0.8rem", color: "text.secondary", ml: "auto" }}>
          {filtered.length} customer{filtered.length === 1 ? "" : "s"}
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
              {["Customer", "Phone", "Orders", "Total spent", "Last order", "Type", "View"].map(
                (label) => (
                  <TableCell key={label} sx={headerCellSx}>
                    {label}
                  </TableCell>
                ),
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} sx={{ py: 7, textAlign: "center" }}>
                  <Typography color="text.secondary" sx={{ fontSize: "0.9rem" }}>
                    {customers.length === 0
                      ? "No customers yet. Orders will appear here as customers."
                      : "No customers match your filters."}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((customer) => (
                <TableRow key={normalizePhone(customer.phone)} hover>
                  <TableCell>
                    <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>
                      {customer.name || "—"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary", whiteSpace: "nowrap" }}>
                    {customer.phone}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600 }}>{customer.orderCount}</TableCell>
                  <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                    {formatBdt(customer.totalSpent)}
                  </TableCell>
                  <TableCell sx={{ whiteSpace: "nowrap", color: "text.secondary" }}>
                    {formatOrderDate(customer.lastOrderAt)}
                  </TableCell>
                  <TableCell>
                    {customer.isRepeat ? (
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
                    ) : (
                      <Box
                        component="span"
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          px: 0.9,
                          py: 0.15,
                          borderRadius: 999,
                          border: "1px solid #e2e8f0",
                          bgcolor: "#f8fafc",
                          color: "#64748b",
                          fontSize: "0.65rem",
                          fontWeight: 600,
                          lineHeight: 1.4,
                          whiteSpace: "nowrap",
                        }}
                      >
                        New customer
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={
                        customer.isRepeat
                          ? "View repeat report"
                          : "View orders for this phone"
                      }
                    >
                      <IconButton
                        size="small"
                        component={Link}
                        href={`/dashboard/admin/reports/repeat-customers?phone=${encodeURIComponent(customer.phone)}`}
                        aria-label="View customer orders"
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
              ))
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
    </Box>
  );
}
