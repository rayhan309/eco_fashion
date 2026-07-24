import { Container, Typography } from "@mui/material";

type ProductPageProps = {
  params: Promise<{ category: string; productSlug: string }>;
};

export default async function ProductPage({ params }: ProductPageProps) {
  const { productSlug } = await params;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, textTransform: "capitalize" }}>
        {productSlug.replace(/-/g, " ")}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Product details will appear here.
      </Typography>
    </Container>
  );
}
