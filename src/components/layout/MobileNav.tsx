"use client";

import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { MOBILE_NAV } from "@/lib/constants/navigation";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
};

export function MobileNav({ open, onClose }: MobileNavProps) {
  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: "min(100vw, 320px)", sm: 360 },
            bgcolor: "background.paper",
          },
        },
      }}
    >
      <Stack sx={{ height: "100%" }}>
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1.75,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.03em" }}>
            Menu
          </Typography>
          <IconButton
            aria-label="Close menu"
            onClick={onClose}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <CloseRoundedIcon fontSize="small" />
          </IconButton>
        </Stack>

        <Divider />

        <List sx={{ flex: 1, px: 1, py: 1.5 }}>
          {MOBILE_NAV.map((item) => (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={onClose}
              sx={{
                borderRadius: 1,
                mb: 0.5,
                py: 1.25,
              }}
            >
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: { sx: { fontWeight: 600, fontSize: "0.95rem" } },
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "divider" }}>
          <Typography variant="body2" color="text.secondary">
            Men&apos;s essentials, thoughtfully made.
          </Typography>
        </Box>
      </Stack>
    </Drawer>
  );
}
