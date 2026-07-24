import { Box, Stack, Typography } from "@mui/material";
import { SetupCard } from "@/components/ui/SetupCard";

export default function HomePage() {
  return (
    <Box sx={{ flex: 1 }}>
      <Stack sx={{ gap: 6, alignItems: "center" }}>
        <Stack sx={{ gap: 1, alignItems: "center", textAlign: "center" }}>
          <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
            Eco Fashion
          </Typography>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Men&apos;s Fashion
          </Typography>
          <Typography variant="body1" color="text.secondary">
            A considered foundation for the next collection.
          </Typography>
        </Stack>
        <SetupCard />
      </Stack>
    </Box>
  );
}
