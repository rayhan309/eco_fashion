import { Typography } from "@mui/material";

export default function ShopPage() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Shop
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Browse the full men&apos;s collection.
      </Typography>
    </>
  );
}
