import { Container, Typography } from "@mui/material";

export default function AccountPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Account
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Profile and order overview will appear here.
      </Typography>
    </Container>
  );
}
