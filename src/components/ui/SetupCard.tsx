"use client";

import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Reveal } from "@/components/motion/Reveal";

const setupItems = ["MUI theme tokens", "Motion animations", "Scalable aliases"];

export function SetupCard() {
  return (
    <Reveal>
      <Card sx={{ maxWidth: 620, width: "100%" }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Stack sx={{ gap: 3 }}>
            <Stack sx={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
              <Chip
                color="secondary"
                icon={<AutoAwesomeRoundedIcon />}
                label="Workspace ready"
                sx={{ fontWeight: 600 }}
              />
              <Typography variant="body2" color="text.secondary">
                v0.1
              </Typography>
            </Stack>
            <Box>
              <Typography variant="h2" component="h1" gutterBottom>
                Build better, beautifully.
              </Typography>
              <Typography color="text.secondary" sx={{ maxWidth: 480 }}>
                Your Next.js foundation now has a central MUI theme and a focused motion layer ready for the eco fashion experience.
              </Typography>
            </Box>
            <Stack sx={{ gap: 1.25 }}>
              {setupItems.map((item) => (
                <Stack sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }} key={item}>
                  <CheckCircleRoundedIcon color="primary" fontSize="small" />
                  <Typography variant="body2">{item}</Typography>
                </Stack>
              ))}
            </Stack>
            <Button variant="contained" size="large" href="/">
              Start exploring
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Reveal>
  );
}
