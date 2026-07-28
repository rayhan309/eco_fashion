"use client";

import { Box, CircularProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { queryKeys } from "@/lib/queries/query-keys";
import { fetchAdminOverviewData } from "@/services/store-queries";
import { QuickActions } from "./QuickActions";
import { RecentActivity } from "./RecentActivity";
import { RecentOrdersCard } from "./RecentOrdersCard";
import { RevenueChart } from "./RevenueChart";
import { StatCards } from "./StatCards";
import { SummaryCards } from "./SummaryCards";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatToday() {
  return new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function AdminOverview() {
  const { user } = useAuth();
  const { data, isPending, isError } = useQuery({
    queryKey: queryKeys.admin.overview(),
    queryFn: fetchAdminOverviewData,
  });

  if (isPending) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (isError || !data) {
    return (
      <Typography color="error">Could not load dashboard overview.</Typography>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, width: "100%", minWidth: 0 }}>
      <Box>
        <Typography
          sx={{
            fontSize: { xs: "1.35rem", sm: "1.5rem" },
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: "text.primary",
          }}
        >
          {getGreeting()}, {user?.name?.split(" ")[0] ?? "Admin"}
        </Typography>
        <Typography sx={{ mt: 0.5, fontSize: "0.875rem", color: "text.secondary" }}>
          {formatToday()}
        </Typography>
        <Typography sx={{ mt: 0.75, fontSize: "0.875rem", color: "text.secondary" }}>
          Store performance from orders and products.
        </Typography>
      </Box>

      <StatCards stats={data.stats} />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", xl: "1fr 320px" },
          alignItems: "stretch",
        }}
      >
        <RevenueChart data={data.revenueByMonth} />
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <RecentActivity activities={data.activities} />
          <QuickActions actions={data.quickActions} />
        </Box>
      </Box>

      <RecentOrdersCard orders={data.recentOrders} />

      <SummaryCards cards={data.summaryCards} />
    </Box>
  );
}
