"use client";

import { Box, Typography } from "@mui/material";
import type { AdminOverviewData } from "@/services/admin";
import { CategorySalesChart } from "./CategorySalesChart";
import { RecentOrdersTable } from "./RecentOrdersTable";
import { RevenueChart } from "./RevenueChart";
import { StatCards } from "./StatCards";
import { TopProductsList } from "./TopProductsList";

type AdminOverviewProps = {
  data: AdminOverviewData;
};

export function AdminOverview({ data }: AdminOverviewProps) {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box>
        <Typography
          sx={{
            fontSize: { xs: "1.35rem", sm: "1.5rem" },
            fontWeight: 700,
            letterSpacing: "-0.03em",
            color: "text.primary",
          }}
        >
          Business overview
        </Typography>
        <Typography sx={{ mt: 0.5, color: "text.secondary", fontSize: "0.95rem" }}>
          Track revenue, orders, and catalog performance at a glance.
        </Typography>
      </Box>

      <StatCards stats={data.stats} />

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", lg: "1.6fr 1fr" },
        }}
      >
        <RevenueChart data={data.revenueByMonth} />
        <CategorySalesChart data={data.salesByCategory} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", lg: "1.6fr 1fr" },
          alignItems: "stretch",
        }}
      >
        <RecentOrdersTable orders={data.recentOrders} />
        <TopProductsList products={data.topProducts} />
      </Box>
    </Box>
  );
}
