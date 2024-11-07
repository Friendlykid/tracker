import { createTheme } from "@mui/material";

// později přidáš další změny, např v barvách
export const setupTheme = (mode) => {
  const theme = createTheme({ palette: { mode } });
  return theme;
};
