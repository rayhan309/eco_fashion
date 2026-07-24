import { createTheme } from "@mui/material/styles";

/** Tailwind `rounded-md` = 6px — used site-wide */
const RADIUS_MD = 6;

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
    divider: "rgba(32, 49, 45, 0.1)",
  },
  shape: {
    borderRadius: RADIUS_MD,
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
      styleOverrides: {
        root: {
          borderRadius: RADIUS_MD,
          cursor: "pointer",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS_MD,
          cursor: "pointer",
        },
      },
    },
    MuiButtonBase: {
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          cursor: "pointer",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS_MD,
          cursor: "pointer",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS_MD,
        },
        rounded: {
          borderRadius: RADIUS_MD,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS_MD,
          border: "1px solid rgba(31, 111, 91, 0.12)",
          boxShadow: "0 18px 50px rgba(32, 49, 45, 0.08)",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRadius: 0,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: RADIUS_MD,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: RADIUS_MD,
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          borderRadius: RADIUS_MD,
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          borderRadius: RADIUS_MD,
        },
      },
    },
  },
});
