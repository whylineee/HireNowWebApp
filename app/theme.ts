import type { PaletteMode } from "@mui/material";
import { createTheme } from "@mui/material/styles";

export function createAppTheme(mode: PaletteMode) {
  const isDark = mode === "dark";

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? "#60A5FA" : "#0A66C2",
      },
      secondary: {
        main: isDark ? "#34D399" : "#0F766E",
      },
      background: {
        default: isDark ? "#0B1220" : "#F7F9FC",
        paper: isDark ? "#111827" : "#FFFFFF",
      },
    },
    shape: {
      borderRadius: 14,
    },
    typography: {
      fontFamily:
        "Manrope, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
    },
    components: {
      MuiCard: {
        defaultProps: {
          elevation: 0,
        },
        styleOverrides: {
          root: ({ theme }) => ({
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: isDark
              ? "0 8px 24px rgba(0, 0, 0, 0.35)"
              : "0 8px 24px rgba(15, 23, 42, 0.04)",
          }),
        },
      },
      MuiButton: {
        defaultProps: {
          disableElevation: true,
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: "none",
            fontWeight: 600,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontWeight: 500,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: "small",
        },
      },
    },
  });
}
