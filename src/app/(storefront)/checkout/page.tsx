import { Typography } from "@mui/material";

export default function CheckoutPage() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Checkout
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Shipping and payment flow will appear here.
      </Typography>
    </>
  );
}
