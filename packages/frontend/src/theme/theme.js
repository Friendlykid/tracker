import { createTheme } from "@mui/material";

// později přidáš další změny, např v barvách

export const setupTheme = (mode) => {
  const theme = createTheme({
    palette: {
      mode,
      primary: { main: "#C09366" },
      secondary: { main: "#6693C0" },
    },
  });
  return theme;
};
