"use client";

import TrendingDownRoundedIcon from "@mui/icons-material/TrendingDownRounded";
import TrendingFlatRoundedIcon from "@mui/icons-material/TrendingFlatRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { Box, Typography } from "@mui/material";
import type { AdminStat } from "@/data/dummy/admin-overview";

type StatCardsProps = {
  stats: AdminStat[];
};

const changeIcon = {
  up: TrendingUpRoundedIcon,
  down: TrendingDownRoundedIcon,
  neutral: TrendingFlatRoundedIcon,
} as const;

const changeColor = {
  up: "#1f6f5b",
  down: "#b45309",
  neutral: "#61716a",
} as const;

export function StatCards({ stats }: StatCardsProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gap: 2,
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          lg: "repeat(4, 1fr)",
        },
      }}
    >
      {stats.map((stat) => {
        const Icon = changeIcon[stat.changeType];

        return (
          <Box
            key={stat.id}
            sx={{
              borderRadius: 1,
              border: "1px solid",
              borderColor: "divider",
              bgcolor: "#fffdf8",
              p: 2.25,
            }}
          >
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 600,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                color: "text.secondary",
              }}
            >
              {stat.label}
            </Typography>
            <Typography
              sx={{
                mt: 1,
                fontSize: { xs: "1.5rem", sm: "1.65rem" },
                fontWeight: 700,
                letterSpacing: "-0.03em",
                color: "text.primary",
              }}
            >
              {stat.value}
            </Typography>
            <Box
              sx={{
                mt: 1.25,
                display: "flex",
                alignItems: "center",
                gap: 0.75,
                flexWrap: "wrap",
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.35,
                  color: changeColor[stat.changeType],
                  fontSize: "0.8rem",
                  fontWeight: 700,
                }}
              >
                <Icon sx={{ fontSize: 16 }} />
                {stat.change}
              </Box>
              <Typography sx={{ fontSize: "0.75rem", color: "text.secondary" }}>
                {stat.hint}
              </Typography>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
