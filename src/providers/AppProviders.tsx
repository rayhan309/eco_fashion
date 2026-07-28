"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { ReactNode } from "react";
import AuthProvider from "@/context/auth/AuthProvider";
import { CartUIProvider } from "@/providers/CartUIProvider";
import { QueryProvider } from "@/providers/QueryProvider";
import { theme } from "@/theme/theme";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <QueryProvider>
          <AuthProvider>
            <CartUIProvider>{children}</CartUIProvider>
          </AuthProvider>
        </QueryProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
