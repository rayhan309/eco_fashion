"use client";

import { Box, Typography } from "@mui/material";
import type { AdminActivity } from "@/data/dummy/admin-overview";

type RecentActivityProps = {
  activities: AdminActivity[];
};

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Box
      sx={{
        borderRadius: 2,
        border: "1px solid",
        borderColor: "rgba(0,0,0,0.06)",
        bgcolor: "#fff",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
        p: 2,
        height: "100%",
      }}
    >
      <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>Recent activity</Typography>
      <Box component="ul" sx={{ m: 0, mt: 1.5, p: 0, listStyle: "none" }}>
        {activities.map((item) => (
          <Box
            component="li"
            key={item.id}
            sx={{
              py: 1.25,
              borderBottom: "1px solid",
              borderColor: "rgba(0,0,0,0.05)",
              "&:last-child": { borderBottom: 0 },
            }}
          >
            <Typography sx={{ fontSize: "0.85rem", color: "text.primary", lineHeight: 1.4 }}>
              {item.message}
            </Typography>
            <Typography sx={{ mt: 0.35, fontSize: "0.75rem", color: "text.secondary" }}>
              {item.timeAgo}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
