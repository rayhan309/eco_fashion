import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1f6f5b",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#e6a34a",
    },
    background: {
      default: "#f6f3ed",
      paper: "#fffdf8",
    },
    text: {
      primary: "#20312d",
      secondary: "#61716a",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
    h1: {
      fontWeight: 700,
      letterSpacing: "-0.03em",
    },
    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid rgba(31, 111, 91, 0.12)",
          boxShadow: "0 18px 50px rgba(32, 49, 45, 0.08)",
        },
      },
    },
  },
});
