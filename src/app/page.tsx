import { Box, Container, Stack, Typography } from "@mui/material";
import { SetupCard } from "@/components/ui/SetupCard";

export default function Home() {
  return (
    <Box component="main" sx={{ flex: 1, py: { xs: 6, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack sx={{ gap: 6, alignItems: "center" }}>
          <Stack sx={{ gap: 1, alignItems: "center", textAlign: "center" }}>
            <Typography variant="overline" color="primary" sx={{ fontWeight: 700 }}>
              Eco Fashion Studio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              A considered foundation for the next collection.
            </Typography>
          </Stack>
          <SetupCard />
        </Stack>
      </Container>
    </Box>
  );
}
