import { Typography } from "@mui/material";

export default function AccountPage() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Account
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Profile and order overview will appear here.
      </Typography>
    </>
  );
}
