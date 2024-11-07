import { themeModeAtom } from "@/lib/recoilProvider";
import { ThemeProvider, useMediaQuery } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useRecoilState } from "recoil";
import { setupTheme } from "./theme";

const Provider = ({ children }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useRecoilState(themeModeAtom);
  const [mounted, setMounted] = useState(false);
  const theme = useMemo(
    () =>
      mode
        ? setupTheme(mode)
        : prefersDarkMode
        ? setupTheme("dark")
        : setupTheme("light"),
    [mode, prefersDarkMode]
  );
  useEffect(() => {
    setMounted(true);
    const savedMode = localStorage.getItem("mode");
    if (!mode) {
      if (!savedMode) {
        localStorage.setItem("mode", prefersDarkMode ? "dark" : "light");
      }
      setMode(localStorage.getItem("mode"));
    }
  }, [prefersDarkMode, mode, setMode]);

  if (!mounted) {
    return null;
  }

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default Provider;
