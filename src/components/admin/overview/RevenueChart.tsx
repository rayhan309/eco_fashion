"use client";

import { Box, Typography } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
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
        borderRadius: 2,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.06)",
        bgcolor: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>Revenue overview</Typography>
      <Typography sx={{ mt: 0.35, fontSize: "0.8rem", color: "text.secondary" }}>
        Last 6 months
      </Typography>

      <Box sx={{ width: "100%", height: { xs: 240, sm: 280 }, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={48}
              tick={{ fill: "#94a3b8", fontSize: 12 }}
              tickFormatter={(value: number) =>
                value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
              }
            />
            <Tooltip
              contentStyle={{
                borderRadius: 8,
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                fontSize: 13,
              }}
              formatter={(value) => {
                const numeric = typeof value === "number" ? value : Number(value);
                return [formatBdt(numeric), "Revenue"];
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#1f6f5b"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#1f6f5b", strokeWidth: 0 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
