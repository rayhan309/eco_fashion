"use client";

import { Box, Typography } from "@mui/material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { RevenuePoint } from "@/data/dummy/admin-overview";

type RevenueChartProps = {
  data: RevenuePoint[];
};

function formatBdt(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <Box
      sx={{
        height: "100%",
        borderRadius: 1,
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "#fffdf8",
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Box
        sx={{
          mb: 2,
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Revenue overview
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: "0.85rem", color: "text.secondary" }}>
            Monthly sales performance for 2026
          </Typography>
        </Box>
      </Box>

      <Box sx={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1f6f5b" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#1f6f5b" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(32,49,45,0.08)" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#61716a", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={64}
              tick={{ fill: "#61716a", fontSize: 12 }}
              tickFormatter={(value: number) =>
                value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: 6,
                border: "1px solid rgba(32,49,45,0.1)",
                boxShadow: "0 12px 30px rgba(32,49,45,0.08)",
              }}
              formatter={(value, name) => {
                const numeric = typeof value === "number" ? value : Number(value);
                if (name === "revenue") return [formatBdt(numeric), "Revenue"];
                return [numeric, "Orders"];
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#1f6f5b"
              strokeWidth={2.5}
              fill="url(#revenueFill)"
              activeDot={{ r: 5, fill: "#1f6f5b" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
