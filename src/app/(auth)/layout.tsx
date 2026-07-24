import type { ReactNode } from "react";
import { Box, Container } from "@mui/material";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        py: { xs: 6, md: 10 },
      }}
    >
      <Container maxWidth="sm">{children}</Container>
    </Box>
  );
}
