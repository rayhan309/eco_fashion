import { Typography } from "@mui/material";

export default function LoginPage() {
  return (
    <>
      <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
        Sign in
      </Typography>
      <Typography color="text.secondary" sx={{ mt: 1 }}>
        Login form will appear here.
      </Typography>
    </>
  );
}
