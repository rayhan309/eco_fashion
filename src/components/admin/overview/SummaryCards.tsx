"use client";

import { Box, Typography } from "@mui/material";
import type { AdminSummaryCard } from "@/data/dummy/admin-overview";

type SummaryCardsProps = {
  cards: AdminSummaryCard[];
};

export function SummaryCards({ cards }: SummaryCardsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "repeat(3, 1fr)" },
      }}
    >
      {cards.map((card) => (
        <Box
          key={card.id}
          sx={{
            borderRadius: 2,
            border: "1px solid",
            borderColor: card.borderColor ?? "rgba(0,0,0,0.06)",
            bgcolor: "#fff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
            p: 2.25,
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
            {card.label}
          </Typography>
          <Typography
            sx={{
              mt: 1,
              fontSize: "1.75rem",
              fontWeight: 700,
              letterSpacing: "-0.03em",
            }}
          >
            {card.value}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "0.8rem", color: "text.secondary" }}>
            {card.sublabel}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
