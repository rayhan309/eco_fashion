"use client";

import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import OpenInNewRoundedIcon from "@mui/icons-material/OpenInNewRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  AppBar,
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  ADMIN_NAV,
  ADMIN_SIDEBAR_WIDTH,
  ADMIN_TOPBAR_HEIGHT,
} from "@/lib/constants/admin";

type AdminShellProps = {
  children: ReactNode;
};

function isNavActive(pathname: string, href: string) {
  if (href === "/dashboard/admin") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "#20312d",
        color: "#fff",
      }}
    >
      <Box sx={{ px: 2.5, py: 2.25 }}>
        <Typography
          component={Link}
          href="/dashboard/admin"
          onClick={onNavigate}
          sx={{
            display: "block",
            fontWeight: 700,
            fontSize: "1.15rem",
            letterSpacing: "-0.04em",
            color: "#fff",
            textDecoration: "none",
          }}
        >
          Eco Fashion
        </Typography>
        <Typography
          sx={{
            mt: 0.35,
            fontSize: "0.7rem",
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          Admin panel
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <List sx={{ flex: 1, px: 1.25, py: 1.5 }}>
        {ADMIN_NAV.map((item) => {
          const active = isNavActive(pathname, item.href);
          const Icon = item.icon;

          return (
            <ListItemButton
              key={item.href}
              component={Link}
              href={item.href}
              onClick={onNavigate}
              selected={active}
              sx={{
                mb: 0.5,
                borderRadius: 1,
                color: active ? "#fff" : "rgba(255,255,255,0.72)",
                bgcolor: active ? "rgba(31,111,91,0.55)" : "transparent",
                "&:hover": {
                  bgcolor: active
                    ? "rgba(31,111,91,0.65)"
                    : "rgba(255,255,255,0.06)",
                },
                "&.Mui-selected": {
                  bgcolor: "rgba(31,111,91,0.55)",
                  "&:hover": {
                    bgcolor: "rgba(31,111,91,0.65)",
                  },
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
                <Icon sx={{ fontSize: 20 }} />
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                slotProps={{
                  primary: {
                    sx: {
                      fontSize: "0.9rem",
                      fontWeight: active ? 700 : 500,
                    },
                  },
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Box sx={{ px: 1.25, pb: 2 }}>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.08)", mb: 1.5 }} />
        <ListItemButton
          component={Link}
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            borderRadius: 1,
            color: "rgba(255,255,255,0.72)",
            "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
          }}
        >
          <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
            <OpenInNewRoundedIcon sx={{ fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText
            primary="View storefront"
            slotProps={{
              primary: { sx: { fontSize: "0.875rem", fontWeight: 500 } },
            }}
          />
        </ListItemButton>
      </Box>
    </Box>
  );
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const activeItem =
    ADMIN_NAV.find((item) => isNavActive(pathname, item.href)) ?? ADMIN_NAV[0];

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "#f6f3ed",
      }}
    >
      <Box
        component="aside"
        sx={{
          width: ADMIN_SIDEBAR_WIDTH,
          flexShrink: 0,
          display: { xs: "none", md: "block" },
          position: "fixed",
          inset: "0 auto 0 0",
          zIndex: (theme) => theme.zIndex.drawer,
        }}
      >
        <SidebarContent pathname={pathname} />
      </Box>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: ADMIN_SIDEBAR_WIDTH,
            boxSizing: "border-box",
            border: 0,
          },
        }}
      >
        <SidebarContent
          pathname={pathname}
          onNavigate={() => setMobileOpen(false)}
        />
      </Drawer>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          ml: { xs: 0, md: `${ADMIN_SIDEBAR_WIDTH}px` },
        }}
      >
        <AppBar
          position="sticky"
          elevation={0}
          color="transparent"
          sx={{
            top: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            borderBottom: "1px solid",
            borderColor: "divider",
            bgcolor: "rgba(255, 253, 248, 0.9)",
            backdropFilter: "blur(14px)",
          }}
        >
          <Toolbar
            sx={{
              minHeight: `${ADMIN_TOPBAR_HEIGHT}px !important`,
              px: { xs: 2, sm: 3 },
              gap: 1.5,
            }}
          >
            <IconButton
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              sx={{
                display: { xs: "inline-flex", md: "none" },
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
              }}
            >
              <MenuRoundedIcon />
            </IconButton>

            <Box sx={{ minWidth: 0, flex: { xs: 1, sm: "unset" } }}>
              <Typography
                variant="subtitle2"
                sx={{
                  color: "text.secondary",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  fontSize: "0.65rem",
                  lineHeight: 1.2,
                }}
              >
                Dashboard
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2,
                  fontSize: { xs: "1rem", sm: "1.1rem" },
                }}
              >
                {activeItem?.label ?? "Admin"}
              </Typography>
            </Box>

            <TextField
              size="small"
              placeholder="Search..."
              aria-label="Search admin"
              sx={{
                display: { xs: "none", sm: "block" },
                ml: { sm: 2 },
                flex: 1,
                maxWidth: 360,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(246, 243, 237, 0.85)",
                },
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, ml: "auto" }}>
              <IconButton
                aria-label="Notifications"
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <NotificationsNoneRoundedIcon />
              </IconButton>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  pl: { xs: 0.5, sm: 1 },
                  pr: { xs: 0, sm: 0.5 },
                  py: 0.5,
                  borderRadius: 1,
                }}
              >
                <Avatar
                  sx={{
                    width: 34,
                    height: 34,
                    bgcolor: "#1f6f5b",
                    fontSize: "0.85rem",
                    fontWeight: 700,
                  }}
                >
                  A
                </Avatar>
                <Box sx={{ display: { xs: "none", md: "block" }, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: "0.8rem",
                      fontWeight: 700,
                      lineHeight: 1.2,
                      color: "text.primary",
                    }}
                  >
                    Admin
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.7rem",
                      color: "text.secondary",
                      lineHeight: 1.2,
                    }}
                  >
                    hello@ecofashion.com
                  </Typography>
                </Box>
              </Box>

              <IconButton
                aria-label="Log out"
                component={Link}
                href="/login"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <LogoutRoundedIcon fontSize="small" />
              </IconButton>
            </Box>
          </Toolbar>
        </AppBar>

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 3 },
            width: "100%",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
