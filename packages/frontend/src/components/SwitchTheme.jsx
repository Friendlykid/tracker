import { themeModeAtom } from "@/lib/recoilProvider";
import { Switch, useMediaQuery } from "@mui/material";
import { useEffect } from "react";
import { useRecoilState } from "recoil";

const SwitchTheme = () => {
  const [mode, setMode] = useRecoilState(themeModeAtom);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  useEffect(() => {
    if (mode) localStorage.setItem("mode", mode);
    else localStorage.setItem("mode", prefersDarkMode ? "dark" : "light");
  }, [mode, prefersDarkMode]);

  return (
    <Switch
      checked={mode === "dark"}
      onChange={() => setMode(mode === "light" ? "dark" : "light")}
    />
  );
};

export default SwitchTheme;
