import { Container, Typography } from "@mui/material";

type CategoryPageProps = {
  params: Promise<{ category: string }>;
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, textTransform: "capitalize" }}>
        {category.replace(/-/g, " ")}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Category products will appear here.
      </Typography>
    </Container>
  );
}
