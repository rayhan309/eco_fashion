import { Typography } from "@mui/material";

type CollectionPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;

  return (
    <>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700, textTransform: "capitalize" }}>
        {slug.replace(/-/g, " ")}
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Collection products will appear here.
      </Typography>
    </>
  );
}
