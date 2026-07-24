import { Typography } from "@mui/material";

export default function WishlistPage() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Wishlist
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Saved items will appear here.
      </Typography>
    </>
  );
}
