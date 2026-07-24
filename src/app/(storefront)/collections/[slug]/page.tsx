import { Container, Typography } from "@mui/material";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, textTransform: "capitalize" }}>
        {slug.replace(/-/g, " ")}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Collection products will appear here.
      </Typography>
    </Container>
  );
}
