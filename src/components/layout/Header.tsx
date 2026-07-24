"use client";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { MobileNav } from "@/components/layout/MobileNav";
import { useCart } from "@/hooks/useCart";
import { MAIN_NAV } from "@/lib/constants/navigation";
import { useCartUI } from "@/providers/CartUIProvider";

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { openCart } = useCartUI();
  const { itemCount } = useCart();

  return (
    <>
      <AppBar
        position="sticky"
        color="transparent"
        elevation={0}
        sx={{
          top: 0,
          zIndex: (theme) => theme.zIndex.appBar,
          borderBottom: "1px solid",
          borderColor: "divider",
          bgcolor: "rgba(255, 253, 248, 0.88)",
          backdropFilter: "blur(14px)",
        }}
      >
        <Container maxWidth="lg" disableGutters>
          <Toolbar
            sx={{
              minHeight: { xs: 64, md: 72 },
              px: { xs: 1.5, sm: 2, md: 3 },
              gap: 1,
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, minWidth: 0 }}>
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

              <Typography
                component={Link}
                href="/"
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: "-0.04em",
                  color: "text.primary",
                  textDecoration: "none",
                  fontSize: { xs: "1.05rem", sm: "1.2rem" },
                  whiteSpace: "nowrap",
                }}
              >
                Eco Fashion
              </Typography>
            </Box>

            <Box
              component="nav"
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
                gap: 0.5,
              }}
            >
              {MAIN_NAV.map((item) => {
                const hasDeeperMatch = MAIN_NAV.some(
                  (other) =>
                    other.href !== item.href &&
                    other.href.startsWith(`${item.href}/`) &&
                    (pathname === other.href || pathname.startsWith(`${other.href}/`)),
                );
                const active =
                  !hasDeeperMatch &&
                  (pathname === item.href || pathname.startsWith(`${item.href}/`));

                return (
                  <Button
                    key={item.href}
                    component={Link}
                    href={item.href}
                    color="inherit"
                    sx={{
                      borderRadius: 1,
                      px: 1.5,
                      minWidth: 0,
                      color: active ? "primary.main" : "text.primary",
                      bgcolor: active ? "rgba(31, 111, 91, 0.08)" : "transparent",
                      "&:hover": {
                        bgcolor: "rgba(31, 111, 91, 0.1)",
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                );
              })}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <IconButton
                component={Link}
                href="/account"
                aria-label="Account"
                sx={{
                  display: { xs: "none", sm: "inline-flex" },
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <PersonOutlineRoundedIcon />
              </IconButton>

              <IconButton
                aria-label="Open cart"
                onClick={openCart}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                }}
              >
                <Badge
                  badgeContent={itemCount}
                  color="primary"
                  max={99}
                  sx={{
                    "& .MuiBadge-badge": {
                      borderRadius: 1,
                      fontWeight: 700,
                      minWidth: 18,
                      height: 18,
                      fontSize: "0.65rem",
                    },
                  }}
                >
                  <ShoppingBagOutlinedIcon />
                </Badge>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </>
  );
}
