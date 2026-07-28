"use client";

import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import {
  Avatar,
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
import { useMemo, useState } from "react";
import type { AdminCustomer, AdminCustomerStats } from "@/data/dummy/admin-customers";
import { ADMIN_ACCENT } from "@/lib/constants/admin";

const PAGE_SIZE = 10;

type AdminCustomersViewProps = {
  customers: AdminCustomer[];
  stats: AdminCustomerStats;
};

function formatBdt(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatRelativeTime(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `${Math.max(1, minutes)}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 48) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
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
          fontSize: "1.65rem",
          fontWeight: 700,
          letterSpacing: "-0.03em",
        }}
      >
        {value}
      </Typography>
      {sublabel ? (
        <Typography sx={{ mt: 0.35, fontSize: "0.8rem", color: "text.secondary" }}>
          {sublabel}
        </Typography>
      ) : null}
    </Box>
  );
}

export function AdminCustomersView({ customers, stats }: AdminCustomersViewProps) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.phone.includes(q.replace(/\s/g, "")) ||
        c.address.toLowerCase().includes(q),
    );
  }, [customers, search]);

  const repeatInView = filtered.filter((c) => c.orderCount > 1).length;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageStart = (currentPage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(pageStart, pageStart + PAGE_SIZE);

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: { sm: "flex-start" },
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
            CRM
          </Typography>
          <Typography
            sx={{
              mt: 0.5,
              fontSize: { xs: "1.35rem", sm: "1.5rem" },
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            Customer directory
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "0.9rem", color: "text.secondary" }}>
            Customer profiles and purchase history from live orders.
          </Typography>
        </Box>
        <Chip
          label={`${stats.totalCustomers} customers`}
          sx={{
            fontWeight: 600,
            bgcolor: "#f1f5f9",
            border: "1px solid #e2e8f0",
          }}
        />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" },
          mb: 2,
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
          borderRadius: 2,
          border: "1px solid",
          borderColor: "rgba(0,0,0,0.06)",
          bgcolor: "#fff",
          boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid", borderColor: "rgba(0,0,0,0.06)" }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by name, phone, or address..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            sx={{ width: "100%", bgcolor: "#f8fafc" }}
          />
        </Box>

        <Box
          sx={{
            px: 2,
            py: 1.25,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            borderBottom: "1px solid",
            borderColor: "rgba(0,0,0,0.06)",
            bgcolor: "#fafafa",
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
            {filtered.length} total customer{filtered.length === 1 ? "" : "s"}
          </Typography>
          <Chip
            size="small"
            icon={<TrendingUpRoundedIcon sx={{ fontSize: "16px !important" }} />}
            label={`${repeatInView} repeat`}
            sx={{
              fontWeight: 600,
              bgcolor: "rgba(31,111,91,0.1)",
              color: ADMIN_ACCENT,
              border: `1px solid rgba(31,111,91,0.2)`,
            }}
          />
        </Box>

        <TableContainer sx={{ width: "100%", overflowX: "auto" }}>
          <Table size="small" sx={{ width: "100%", minWidth: 960 }}>
            <TableHead>
              <TableRow>
                {[
                  "Customer",
                  "Phone",
                  "Orders",
                  "Total spent",
                  "Last order",
                  "Address",
                  "Actions",
                ].map((h) => (
                  <TableCell
                    key={h}
                    align={h === "Actions" ? "right" : "left"}
                    sx={{
                      fontWeight: 700,
                      fontSize: "0.7rem",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: "text.secondary",
                      bgcolor: "#f8fafc",
                      borderBottomColor: "rgba(0,0,0,0.06)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {pageRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} sx={{ py: 6, textAlign: "center" }}>
                    <Typography color="text.secondary">No customers found.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                pageRows.map((customer) => {
                  const isRepeat = customer.orderCount > 1;
                  return (
                    <TableRow key={customer.id} hover>
                      <TableCell sx={{ minWidth: 200 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
                          <Avatar
                            sx={{
                              width: 36,
                              height: 36,
                              bgcolor: ADMIN_ACCENT,
                              fontSize: "0.8rem",
                              fontWeight: 700,
                            }}
                          >
                            {initials(customer.name)}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontSize: "0.875rem", fontWeight: 600 }}>
                              {customer.name}
                            </Typography>
                            <Chip
                              label={isRepeat ? "Repeat customer" : "New customer"}
                              size="small"
                              sx={{
                                mt: 0.35,
                                height: 22,
                                fontSize: "0.65rem",
                                fontWeight: 600,
                                bgcolor: isRepeat ? "rgba(31,111,91,0.12)" : "#f1f5f9",
                                color: isRepeat ? ADMIN_ACCENT : "#64748b",
                                border: isRepeat
                                  ? "1px solid rgba(31,111,91,0.25)"
                                  : "1px solid #e2e8f0",
                              }}
                            />
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell sx={{ whiteSpace: "nowrap", fontSize: "0.85rem" }}>
                        {customer.phone}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={customer.orderCount}
                          size="small"
                          sx={{
                            minWidth: 28,
                            fontWeight: 700,
                            bgcolor: "#f1f5f9",
                            border: "1px solid #e2e8f0",
                          }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, whiteSpace: "nowrap" }}>
                        {formatBdt(customer.totalSpent)}
                      </TableCell>
                      <TableCell sx={{ fontSize: "0.85rem", color: "text.secondary" }}>
                        {formatRelativeTime(customer.lastOrderAt)}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 220, fontSize: "0.85rem", color: "text.secondary" }}>
                        {customer.address}
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title="View profile">
                          <IconButton size="small" aria-label={`View ${customer.name}`}>
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

        <Box
          sx={{
            px: 2,
            py: 1.5,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            borderTop: "1px solid",
            borderColor: "rgba(0,0,0,0.06)",
            bgcolor: "#fafafa",
          }}
        >
          <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
            {filtered.length === 0
              ? "Showing 0 of 0"
              : `Showing ${pageStart + 1}–${Math.min(pageStart + PAGE_SIZE, filtered.length)} of ${filtered.length}`}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Button
              size="small"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              sx={{ textTransform: "none", minWidth: 72 }}
            >
              Previous
            </Button>
            <Typography sx={{ fontSize: "0.8rem", color: "text.secondary" }}>
              Page {currentPage} / {totalPages}
            </Typography>
            <Button
              size="small"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              sx={{ textTransform: "none", minWidth: 56 }}
            >
              Next
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
