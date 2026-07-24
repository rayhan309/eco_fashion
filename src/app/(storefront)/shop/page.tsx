import { Container, Typography } from "@mui/material";

export default function ShopPage() {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Shop
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Browse the full men&apos;s collection.
      </Typography>
    </Container>
  );
}
