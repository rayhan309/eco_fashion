"use client";

import ExpandLessRoundedIcon from "@mui/icons-material/ExpandLessRounded";
import ExpandMoreRoundedIcon from "@mui/icons-material/ExpandMoreRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import {
  Avatar,
  Box,
  Button,
  Collapse,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ReactNode } from "react";
import {
  ADMIN_ACCENT,
  ADMIN_NAV,
  ADMIN_SIDEBAR_BG,
  ADMIN_SIDEBAR_WIDTH,
  type AdminNavEntry,
} from "@/lib/constants/admin";

type AdminShellProps = {
  children: ReactNode;
};

function isLinkActive(pathname: string, href: string) {
  if (href === "/dashboard/admin") return pathname === href;
  if (href === "/dashboard/admin/settings") {
    return pathname === href;
  }
  if (href === "/dashboard/admin/products") {
    return pathname === href;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isGroupActive(pathname: string, entry: AdminNavEntry) {
  if (entry.type === "link") return isLinkActive(pathname, entry.href);
  return entry.children.some((child) => isLinkActive(pathname, child.href));
}

function SidebarContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  const defaultOpen = useMemo(() => {
    const open: Record<string, boolean> = {};
    ADMIN_NAV.forEach((entry) => {
      if (entry.type === "group" && isGroupActive(pathname, entry)) {
        open[entry.label] = true;
      }
    });
    return open;
  }, [pathname]);

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(defaultOpen);

  function toggleGroup(label: string) {
    setOpenGroups((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: ADMIN_SIDEBAR_BG,
        color: "#fff",
      }}
    >
      <Box sx={{ px: 2, py: 2.5 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 1,
              bgcolor: ADMIN_ACCENT,
              display: "grid",
              placeItems: "center",
              fontWeight: 800,
              fontSize: "0.75rem",
              letterSpacing: "0.04em",
            }}
          >
            EF
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography
              component={Link}
              href="/dashboard/admin"
              onClick={onNavigate}
              sx={{
                display: "block",
                fontWeight: 700,
                fontSize: "0.95rem",
                color: "#fff",
                textDecoration: "none",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Eco Fashion
            </Typography>
            <Typography sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)" }}>
              Admin
            </Typography>
          </Box>
        </Box>
      </Box>

      <Typography
        sx={{
          px: 2.5,
          pb: 1,
          fontSize: "0.65rem",
          fontWeight: 700,
          letterSpacing: "0.14em",
          color: "rgba(255,255,255,0.35)",
        }}
      >
        MAIN MENU
      </Typography>

      <List sx={{ flex: 1, px: 1.25, py: 0, overflowY: "auto" }}>
        {ADMIN_NAV.map((entry) => {
          if (entry.type === "link") {
            const active = isLinkActive(pathname, entry.href);
            const Icon = entry.icon;
            return (
              <ListItemButton
                key={entry.href}
                component={Link}
                href={entry.href}
                onClick={onNavigate}
                sx={{
                  mb: 0.35,
                  borderRadius: 1,
                  py: 1,
                  color: active ? "#fff" : "rgba(255,255,255,0.72)",
                  bgcolor: active ? "rgba(255,255,255,0.08)" : "transparent",
                  borderLeft: active ? `3px solid ${ADMIN_ACCENT}` : "3px solid transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? ADMIN_ACCENT : "inherit" }}>
                  <Icon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={entry.label}
                  slotProps={{
                    primary: { sx: { fontSize: "0.875rem", fontWeight: active ? 600 : 500 } },
                  }}
                />
              </ListItemButton>
            );
          }

          const Icon = entry.icon;
          const open = openGroups[entry.label] ?? false;
          const groupActive = isGroupActive(pathname, entry);

          return (
            <Box key={entry.label}>
              <ListItemButton
                onClick={() => toggleGroup(entry.label)}
                sx={{
                  mb: 0.35,
                  borderRadius: 1,
                  py: 1,
                  color: groupActive ? "#fff" : "rgba(255,255,255,0.72)",
                  bgcolor: groupActive ? "rgba(255,255,255,0.06)" : "transparent",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: groupActive ? ADMIN_ACCENT : "inherit" }}>
                  <Icon sx={{ fontSize: 20 }} />
                </ListItemIcon>
                <ListItemText
                  primary={entry.label}
                  slotProps={{
                    primary: { sx: { fontSize: "0.875rem", fontWeight: 500 } },
                  }}
                />
                {open ? (
                  <ExpandLessRoundedIcon sx={{ fontSize: 18, opacity: 0.6 }} />
                ) : (
                  <ExpandMoreRoundedIcon sx={{ fontSize: 18, opacity: 0.6 }} />
                )}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List disablePadding sx={{ pl: 2, pb: 0.5 }}>
                  {entry.children.map((child) => {
                    const active = isLinkActive(pathname, child.href);
                    return (
                      <ListItemButton
                        key={`${entry.label}-${child.label}`}
                        component={Link}
                        href={child.href}
                        onClick={onNavigate}
                        sx={{
                          borderRadius: 1,
                          py: 0.75,
                          mb: 0.25,
                          color: active ? "#fff" : "rgba(255,255,255,0.55)",
                          "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
                        }}
                      >
                        <ListItemText
                          primary={child.label}
                          slotProps={{
                            primary: { sx: { fontSize: "0.8rem", fontWeight: active ? 600 : 400 } },
                          }}
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              </Collapse>
            </Box>
          );
        })}
      </List>

      <Box
        sx={{
          m: 1.5,
          p: 1.5,
          borderRadius: 1,
          bgcolor: "rgba(0,0,0,0.2)",
          border: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1.5 }}>
          <Avatar sx={{ width: 36, height: 36, bgcolor: ADMIN_ACCENT, fontSize: "0.8rem" }}>
            SA
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>
              Super Admin
            </Typography>
            <Typography
              sx={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.2 }}
            >
              Administrator
            </Typography>
          </Box>
        </Box>
        <Button
          component={Link}
          href="/login"
          fullWidth
          variant="outlined"
          startIcon={<LogoutRoundedIcon sx={{ fontSize: 18 }} />}
          sx={{
            borderColor: "rgba(239,68,68,0.55)",
            color: "#fca5a5",
            py: 0.85,
            fontSize: "0.8rem",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#ef4444",
              bgcolor: "rgba(239,68,68,0.12)",
            },
          }}
        >
          Sign out
        </Button>
        <Button
          component={Link}
          href="/"
          target="_blank"
          fullWidth
          startIcon={<StorefrontOutlinedIcon sx={{ fontSize: 18 }} />}
          sx={{
            mt: 1,
            color: "rgba(255,255,255,0.65)",
            fontSize: "0.75rem",
            justifyContent: "flex-start",
            "&:hover": { bgcolor: "rgba(255,255,255,0.05)" },
          }}
        >
          View storefront
        </Button>
      </Box>
    </Box>
  );
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f4f5f7" }}>
      <Box
        component="aside"
        sx={{
          width: ADMIN_SIDEBAR_WIDTH,
          flexShrink: 0,
          display: { xs: "none", lg: "block" },
          position: "fixed",
          inset: "0 auto 0 0",
          zIndex: (theme) => theme.zIndex.drawer,
          borderRight: "1px solid rgba(0,0,0,0.06)",
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
          display: { xs: "block", lg: "none" },
          "& .MuiDrawer-paper": {
            width: ADMIN_SIDEBAR_WIDTH,
            boxSizing: "border-box",
            border: 0,
          },
        }}
      >
        <SidebarContent pathname={pathname} onNavigate={() => setMobileOpen(false)} />
      </Drawer>

      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: "flex",
          flexDirection: "column",
          ml: { xs: 0, lg: `${ADMIN_SIDEBAR_WIDTH}px` },
          width: { xs: "100%", lg: `calc(100% - ${ADMIN_SIDEBAR_WIDTH}px)` },
        }}
      >
        <Box
          component="header"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: (theme) => theme.zIndex.appBar,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: 1,
            px: { xs: 2, sm: 3 },
            py: 1.5,
            minHeight: 56,
            bgcolor: "#fff",
            borderBottom: "1px solid",
            borderColor: "rgba(0,0,0,0.06)",
          }}
        >
          <IconButton
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            sx={{
              mr: "auto",
              display: { lg: "none" },
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1,
            }}
          >
            <MenuRoundedIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Avatar sx={{ width: 36, height: 36, bgcolor: ADMIN_ACCENT, fontSize: "0.8rem" }}>
              SA
            </Avatar>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.2 }}>
                Super Admin
              </Typography>
              <Typography sx={{ fontSize: "0.7rem", color: "text.secondary", lineHeight: 1.2 }}>
                Administrator
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, sm: 2.5, md: 3 },
            width: "100%",
            maxWidth: "100%",
            boxSizing: "border-box",
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
}
