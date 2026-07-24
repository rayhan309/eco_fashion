"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import type { ReactNode } from "react";
import { CartUIProvider } from "@/providers/CartUIProvider";
import { theme } from "@/theme/theme";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartUIProvider>{children}</CartUIProvider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
