import { Typography } from "@mui/material";

export default function CartPage() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Cart
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Your selected items will appear here.
      </Typography>
    </>
  );
}
