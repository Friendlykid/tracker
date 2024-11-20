import { modeAtom } from "@/lib/atoms";
import { Switch } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useRecoilState } from "recoil";
import { DarkMode } from "@mui/icons-material";

const SwitchTheme = () => {
  const [mode, setMode] = useRecoilState(modeAtom);

  return (
    <>
      {mode === "light" ? <LightModeIcon /> : <DarkMode />}
      <Switch
        checked={mode === "dark"}
        onChange={() => setMode(mode === "light" ? "dark" : "light")}
      />
    </>
  );
};

export default SwitchTheme;
