"use client";

import { Box, Typography } from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { CategorySalesPoint } from "@/data/dummy/admin-overview";

type CategorySalesChartProps = {
  data: CategorySalesPoint[];
};

function formatBdt(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

export function CategorySalesChart({ data }: CategorySalesChartProps) {
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
      <Box sx={{ mb: 2 }}>
        <Typography sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
          Sales by category
        </Typography>
        <Typography sx={{ mt: 0.35, fontSize: "0.85rem", color: "text.secondary" }}>
          Current month breakdown
        </Typography>
      </Box>

      <Box sx={{ width: "100%", height: 280 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(32,49,45,0.08)" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#61716a", fontSize: 11 }}
              interval={0}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fill: "#61716a", fontSize: 12 }}
              tickFormatter={(value: number) =>
                value >= 1000 ? `${Math.round(value / 1000)}k` : String(value)
              }
            />
            <Tooltip
              cursor={{ fill: "rgba(31,111,91,0.06)" }}
              contentStyle={{
                borderRadius: 6,
                border: "1px solid rgba(32,49,45,0.1)",
                boxShadow: "0 12px 30px rgba(32,49,45,0.08)",
              }}
              formatter={(value) => {
                const numeric = typeof value === "number" ? value : Number(value);
                return [formatBdt(numeric), "Sales"];
              }}
            />
            <Bar dataKey="sales" radius={[6, 6, 0, 0]} maxBarSize={42}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  );
}
