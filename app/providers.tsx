"use client";

import { useMemo } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { createAppTheme } from "./theme";
import { AppSettingsProvider, useAppSettings } from "@/lib/app-settings";

type ProvidersProps = {
  children: React.ReactNode;
};

function ThemedApp({ children }: ProvidersProps) {
  const { themeMode } = useAppSettings();
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <AppRouterCacheProvider>
      <AppSettingsProvider>
        <ThemedApp>{children}</ThemedApp>
      </AppSettingsProvider>
    </AppRouterCacheProvider>
  );
}
