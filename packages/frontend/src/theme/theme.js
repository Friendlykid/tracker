import { createTheme } from "@mui/material";

// později přidáš další změny, např v barvách
const lightPalette = {
  mode: "light",
  primary: { main: "#FF9800", light: "#FFE0B2" },
  secondary: { main: "#607D8B", light: "#FF9800" },
  text: {
    primary: "#212121",
    secondary: "#757575",
  },
};

const darkPalette = {
  mode: "dark",
  primary: { main: "#F57C00", light: "#FF9800", dark: "#F57C00" },
  secondary: { main: "#607D8B", light: "#607D8B", dark: "#455A64" },
};

export const useCreateTheme = (mode) => {
  const theme = createTheme({
    palette: mode === "light" ? lightPalette : darkPalette,
    cssVariables: {
      colorSchemeSelector: "class",
    },
    cssVariables: {
      colorSchemeSelector: "class",
    },
  });
  return theme;
};
