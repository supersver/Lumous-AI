import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    contentSecondary: string;
    surface: {
      raised: string;
      elevated: string;
      hover: string;
      selected: string;
    };
  }

  interface PaletteOptions {
    contentSecondary?: string;
    surface?: {
      raised?: string;
      elevated?: string;
      hover?: string;
      selected?: string;
    };
  }
}

export const appTheme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#46B8C8",
      light: "#72D4DF",
      dark: "#278A99",
      contrastText: "#061317",
    },

    secondary: {
      main: "#8B93FF",
      light: "#AEB3FF",
      dark: "#666ED6",
      contrastText: "#0B0D1A",
    },

    background: {
      default: "#070B12",
      paper: "#0D131D",
    },

    text: {
      primary: "#E8EDF3",
      secondary: "#8996A6",
      disabled: "#566171",
    },

    contentSecondary: "#7F8C9D",

    surface: {
      raised: "#111925",
      elevated: "#151E2C",
      hover: "#182332",
      selected: "#192F36",
    },

    divider: "#1C2633",

    action: {
      active: "#AAB6C5",
      hover: "rgba(70, 184, 200, 0.07)",
      selected: "rgba(70, 184, 200, 0.12)",
      disabled: "rgba(137, 150, 166, 0.35)",
      disabledBackground: "rgba(137, 150, 166, 0.08)",
      focus: "rgba(70, 184, 200, 0.18)",
    },

    error: {
      main: "#F16B72",
      light: "#FF969B",
      dark: "#C94B52",
      contrastText: "#16090B",
    },

    warning: {
      main: "#E6A84E",
      light: "#F3C679",
      dark: "#B87C2D",
      contrastText: "#171006",
    },

    success: {
      main: "#45C59A",
      light: "#74D9B8",
      dark: "#2E9674",
      contrastText: "#06130F",
    },

    info: {
      main: "#5E9EF6",
      light: "#86B8FA",
      dark: "#3E78C7",
      contrastText: "#08111F",
    },
  },

  shape: {
    borderRadius: 10,
  },

  typography: {
    fontFamily: [
      "Inter",
      "ui-sans-serif",
      "system-ui",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "sans-serif",
    ].join(","),

    h1: {
      fontWeight: 700,
      letterSpacing: "-0.025em",
    },

    h2: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },

    h3: {
      fontWeight: 650,
      letterSpacing: "-0.015em",
    },

    h4: {
      fontWeight: 650,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    body1: {
      color: "#E8EDF3",
    },

    body2: {
      color: "#8996A6",
    },

    button: {
      fontWeight: 600,
      letterSpacing: "-0.01em",
    },
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          backgroundColor: "#070B12",
        },

        body: {
          backgroundColor: "#070B12",
          color: "#E8EDF3",
        },

        "*": {
          scrollbarWidth: "thin",
          scrollbarColor: "#263342 transparent",
        },

        "*::-webkit-scrollbar": {
          width: 7,
          height: 7,
        },

        "*::-webkit-scrollbar-track": {
          background: "transparent",
        },

        "*::-webkit-scrollbar-thumb": {
          backgroundColor: "#263342",
          borderRadius: 10,
        },

        "*::-webkit-scrollbar-thumb:hover": {
          backgroundColor: "#344456",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid #1C2633",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#0D131D",
          backgroundImage: "none",
          border: "1px solid #1C2633",
          boxShadow: "none",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0D131D",
          backgroundImage: "none",
          borderRight: "1px solid #1C2633",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#0D131D",
          backgroundImage: "none",
          borderBottom: "1px solid #1C2633",
          boxShadow: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 8,
          boxShadow: "none",
          fontWeight: 600,

          "&:hover": {
            boxShadow: "none",
          },

          "&.MuiButton-containedPrimary:hover": {
            boxShadow: "0 4px 14px rgba(70, 184, 200, 0.18)",
          },

          "&.MuiButton-containedSecondary:hover": {
            boxShadow: "0 4px 14px rgba(139, 147, 255, 0.16)",
          },
        },

        outlined: {
          borderColor: "#263342",

          "&:hover": {
            borderColor: "#46B8C8",
            backgroundColor: "rgba(70, 184, 200, 0.06)",
          },
        },

        text: {
          "&:hover": {
            backgroundColor: "rgba(70, 184, 200, 0.07)",
          },
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          color: "#8996A6",

          "&:hover": {
            color: "#E8EDF3",
            backgroundColor: "rgba(70, 184, 200, 0.07)",
          },

          "&.MuiIconButton-colorPrimary": {
            color: "#46B8C8",
          },
        },
      },
    },

    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,

          "&:hover": {
            backgroundColor: "rgba(70, 184, 200, 0.06)",
          },

          "&.Mui-selected": {
            backgroundColor: "rgba(70, 184, 200, 0.10)",

            "&:hover": {
              backgroundColor: "rgba(70, 184, 200, 0.14)",
            },

            "& .MuiListItemIcon-root": {
              color: "#46B8C8",
            },

            "& .MuiListItemText-primary": {
              color: "#E8EDF3",
            },
          },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 36,
          color: "#7F8C9D",
        },
      },
    },

    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: "#E8EDF3",
        },

        secondary: {
          color: "#7F8C9D",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#0B111A",
          borderRadius: 8,

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#263342",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#344456",
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#46B8C8",
            borderWidth: 1,
          },

          "&.Mui-error .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F16B72",
          },
        },

        input: {
          color: "#E8EDF3",

          "&::placeholder": {
            color: "#566171",
            opacity: 1,
          },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        root: {
          color: "#E8EDF3",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "#7F8C9D",

          "&.Mui-focused": {
            color: "#46B8C8",
          },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: {
          color: "#E8EDF3",
        },

        icon: {
          color: "#7F8C9D",
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#111925",
          backgroundImage: "none",
          border: "1px solid #263342",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.35)",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          margin: "2px 4px",

          "&:hover": {
            backgroundColor: "rgba(70, 184, 200, 0.07)",
          },

          "&.Mui-selected": {
            backgroundColor: "rgba(70, 184, 200, 0.10)",

            "&:hover": {
              backgroundColor: "rgba(70, 184, 200, 0.14)",
            },
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#151E2C",
          border: "1px solid #263342",
          color: "#E8EDF3",
          fontSize: "0.75rem",
          borderRadius: 6,
        },

        arrow: {
          color: "#151E2C",
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: "#1C2633",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
        },

        outlined: {
          borderColor: "#263342",
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          minHeight: 44,
          color: "#7F8C9D",
          fontWeight: 600,

          "&.Mui-selected": {
            color: "#46B8C8",
          },
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          backgroundColor: "#46B8C8",
          height: 2,
        },
      },
    },

    MuiCircularProgress: {
      styleOverrides: {
        colorPrimary: {
          color: "#46B8C8",
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          backgroundColor: "#182332",
          borderRadius: 4,
        },

        bar: {
          backgroundColor: "#46B8C8",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          backgroundColor: "#0D131D",
          backgroundImage: "none",
          border: "1px solid #263342",
          boxShadow: "0 24px 64px rgba(0, 0, 0, 0.45)",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          color: "#E8EDF3",
          fontWeight: 650,
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          color: "#8996A6",
        },
      },
    },

    MuiSnackbarContent: {
      styleOverrides: {
        root: {
          backgroundColor: "#151E2C",
          border: "1px solid #263342",
          color: "#E8EDF3",
        },
      },
    },
  },
});
