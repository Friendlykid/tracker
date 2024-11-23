import { ThemeProvider, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useCreateTheme } from "./theme";
import { useRecoilState } from "recoil";
import { modeAtom } from "@/lib/atoms";

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useRecoilState(modeAtom);
  const theme = useCreateTheme(mode);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  useEffect(() => {
    if (prefersDarkMode) {
      setMode("dark");
    }
  }, [prefersDarkMode, setMode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};
