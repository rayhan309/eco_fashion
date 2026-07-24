"use client";

import Link from "next/link";
import { Box, Stack, Typography } from "@mui/material";
import { Container } from "@/components/container";
import { FOOTER_NAV } from "@/lib/constants/navigation";

export function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        py: { xs: 4, md: 5 },
        mt: "auto",
      }}
    >
      <Container>
        <Stack
          direction={{ xs: "column", md: "row" }}
          sx={{
            gap: 3,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
          }}
        >
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: "-0.03em" }}>
              Eco Fashion
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Men&apos;s fashion for everyday clarity.
            </Typography>
          </Box>

          <Stack direction="row" sx={{ gap: 1, flexWrap: "wrap" }}>
            {FOOTER_NAV.map((item) => (
              <Typography
                key={item.href}
                component={Link}
                href={item.href}
                variant="body2"
                color="text.secondary"
                sx={{
                  textDecoration: "none",
                  px: 1.25,
                  py: 0.75,
                  borderRadius: 1,
                  "&:hover": {
                    color: "text.primary",
                    bgcolor: "rgba(31, 111, 91, 0.08)",
                  },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
