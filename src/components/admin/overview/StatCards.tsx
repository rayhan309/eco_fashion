"use client";

import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import { Box, Typography } from "@mui/material";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { AdminStat } from "@/data/dummy/admin-overview";

type StatCardsProps = {
  stats: AdminStat[];
};

const statIcons = {
  revenue: AttachMoneyRoundedIcon,
  orders: ShoppingBagOutlinedIcon,
  products: Inventory2OutlinedIcon,
  customers: PeopleOutlineOutlinedIcon,
} as const;

function adminCardSx() {
  return {
    borderRadius: 2,
    border: "1px solid",
    borderColor: "rgba(0,0,0,0.06)",
    bgcolor: "#fff",
    boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column" as const,
  };
}

export function StatCards({ stats }: StatCardsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          xl: "repeat(4, 1fr)",
        },
      }}
    >
      {stats.map((stat) => {
        const Icon =
          statIcons[stat.id as keyof typeof statIcons] ?? ShoppingBagOutlinedIcon;
        const chartData = stat.sparkline.map((value, index) => ({ index, value }));

        return (
          <Box key={stat.id} sx={adminCardSx()}>
            <Box sx={{ p: 2, pb: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 1,
                }}
              >
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "text.secondary",
                  }}
                >
                  {stat.label}
                </Typography>
                <Box
                  sx={{
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: `${stat.accent}18`,
                    color: stat.accent,
                  }}
                >
                  <Icon sx={{ fontSize: 18 }} />
                </Box>
              </Box>
              <Typography
                sx={{
                  mt: 1.25,
                  fontSize: { xs: "1.5rem", sm: "1.65rem" },
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                  color: "text.primary",
                }}
              >
                {stat.value}
              </Typography>
              <Typography sx={{ mt: 0.35, fontSize: "0.8rem", color: "text.secondary" }}>
                {stat.sublabel}
              </Typography>
            </Box>
            <Box sx={{ height: 48, width: "100%", mt: "auto" }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`spark-${stat.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={stat.accent} stopOpacity={0.35} />
                      <stop offset="100%" stopColor={stat.accent} stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={stat.accent}
                    strokeWidth={2}
                    fill={`url(#spark-${stat.id})`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
