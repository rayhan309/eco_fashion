import type { ReactNode } from "react";
import { Box } from "@mui/material";
import { Container } from "@/components/container";

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
      <Container size="narrow">{children}</Container>
    </Box>
  );
}
