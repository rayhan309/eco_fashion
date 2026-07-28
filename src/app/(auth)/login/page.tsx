import { Suspense } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export default function LoginPage() {
  return (
    <Box sx={{ maxWidth: 420, mx: "auto", width: "100%" }}>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          letterSpacing: "-0.02em",
          textAlign: { xs: "left", sm: "center" },
        }}
      >
        Welcome
      </Typography>
      <Suspense
        fallback={
          <Box sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <CircularProgress size={28} />
          </Box>
        }
      >
        <AdminLoginForm />
      </Suspense>
    </Box>
  );
}
