"use client";

import { Box, Typography } from "@mui/material";
import Link from "next/link";
import type { TopProduct } from "@/data/dummy/admin-overview";

type TopProductsListProps = {
  products: TopProduct[];
};

function formatBdt(value: number) {
  return `৳${value.toLocaleString("en-BD")}`;
}

export function TopProductsList({ products }: TopProductsListProps) {
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
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, letterSpacing: "-0.02em" }}>
            Top products
          </Typography>
          <Typography sx={{ mt: 0.35, fontSize: "0.85rem", color: "text.secondary" }}>
            Best sellers this month
          </Typography>
        </Box>
        <Typography
          component={Link}
          href="/dashboard/admin/products"
          sx={{
            fontSize: "0.85rem",
            fontWeight: 600,
            color: "#1f6f5b",
            textDecoration: "none",
            "&:hover": { color: "#185a4a" },
          }}
        >
          Manage
        </Typography>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {products.map((product, index) => (
          <Box
            key={product.id}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              py: 1.25,
              borderBottom:
                index === products.length - 1
                  ? "none"
                  : "1px solid rgba(32,49,45,0.08)",
            }}
          >
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: 1,
                display: "grid",
                placeItems: "center",
                bgcolor: "rgba(31,111,91,0.1)",
                color: "#1f6f5b",
                fontSize: "0.8rem",
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {index + 1}
            </Box>
            <Box sx={{ minWidth: 0, flex: 1 }}>
              <Typography
                sx={{
                  fontWeight: 600,
                  fontSize: "0.9rem",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {product.title}
              </Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {product.category} · {product.sold} sold
              </Typography>
            </Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: "0.85rem",
                color: "text.primary",
                flexShrink: 0,
              }}
            >
              {formatBdt(product.revenue)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
