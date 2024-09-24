import { deepPurple } from "@mui/material/colors";
import { ThemeOptions, createTheme } from "@mui/material/styles";

const fontFamily = ["sans-serif", "Montserrat"].join(",");

export function createThemeOptions(isDark: boolean): ThemeOptions {
  return {
    palette: {
      mode: isDark ? "dark" : "light",
      primary: deepPurple,
    },
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 990,
        lg: 1280,
        xl: 1920,
      },
    },
    typography: {
      fontFamily,
      fontWeightRegular: 400,
      fontWeightBold: 700,
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            scrollbarColor: "#6b6b6b transparent",
            "&::-webkit-scrollbar, & *::-webkit-scrollbar": {
              backgroundColor: "transparent",
            },
            "&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb": {
              borderRadius: 8,
              backgroundColor: "#6b6b6b",
              minHeight: 24,
            },
            "&::-webkit-scrollbar-thumb:focus, & *::-webkit-scrollbar-thumb:focus":
              {
                backgroundColor: "#959595",
              },
            "&::-webkit-scrollbar-thumb:active, & *::-webkit-scrollbar-thumb:active":
              {
                backgroundColor: "#959595",
              },
            "&::-webkit-scrollbar-thumb:hover, & *::-webkit-scrollbar-thumb:hover":
              {
                backgroundColor: "#959595",
              },
            "&::-webkit-scrollbar-corner, & *::-webkit-scrollbar-corner": {
              backgroundColor: "transparent",
            },
          },
        },
      },
    },
  } as const;
}

export type Theme = ReturnType<typeof createTheme>;
