import { modeAtom } from "@/lib/atoms";
import { Stack, Switch } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useRecoilState } from "recoil";
import { DarkMode } from "@mui/icons-material";

const SwitchTheme = () => {
  const [mode, setMode] = useRecoilState(modeAtom);

  return (
    <Stack alignItems="center" pl={2} direction="row" width="100%">
      {mode === "light" ? <LightModeIcon /> : <DarkMode />}
      <Switch
        checked={mode === "dark"}
        onChange={() => setMode(mode === "light" ? "dark" : "light")}
      />
    </Stack>
  );
};

export default SwitchTheme;
