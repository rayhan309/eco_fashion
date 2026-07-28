"use client";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import ChevronRightRoundedIcon from "@mui/icons-material/ChevronRightRounded";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { Box, Typography } from "@mui/material";
import Link from "next/link";
import type { AdminQuickAction } from "@/data/dummy/admin-overview";

type QuickActionsProps = {
  actions: AdminQuickAction[];
};

const actionIcons: Record<string, typeof AddRoundedIcon> = {
  "qa-1": AddRoundedIcon,
  "qa-2": ReceiptLongOutlinedIcon,
  "qa-3": CategoryOutlinedIcon,
};

export function QuickActions({ actions }: QuickActionsProps) {
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
      <Typography sx={{ fontWeight: 700, fontSize: "0.95rem" }}>Quick actions</Typography>
      <Box component="ul" sx={{ m: 0, mt: 1.25, p: 0, listStyle: "none" }}>
        {actions.map((action) => {
          const Icon = actionIcons[action.id] ?? AddRoundedIcon;
          return (
            <Box component="li" key={action.id}>
              <Box
                component={Link}
                href={action.href}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.25,
                  py: 1.1,
                  textDecoration: "none",
                  color: "text.primary",
                  borderRadius: 1,
                  "&:hover": { bgcolor: "rgba(31,111,91,0.06)" },
                }}
              >
                <Icon sx={{ fontSize: 20, color: "#1f6f5b" }} />
                <Typography sx={{ flex: 1, fontSize: "0.875rem", fontWeight: 500 }}>
                  {action.label}
                </Typography>
                <ChevronRightRoundedIcon sx={{ fontSize: 20, color: "text.secondary" }} />
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
