import { Typography } from "@mui/material";

export default function AboutPage() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        About
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Brand story and values will appear here.
      </Typography>
    </>
  );
}
