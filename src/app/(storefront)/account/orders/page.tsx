import { Container, Typography } from "@mui/material";

export default function OrdersPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Orders
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Order history will appear here.
      </Typography>
    </Container>
  );
}
