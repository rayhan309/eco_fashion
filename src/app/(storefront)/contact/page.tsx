import { Container, Typography } from "@mui/material";

export default function ContactPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Contact
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Support and contact details will appear here.
      </Typography>
    </Container>
  );
}