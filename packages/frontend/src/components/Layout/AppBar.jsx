import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Typography,
  Stack,
  useTheme,
} from "@mui/material";
import { UserCircle } from "./UserCircle";
import { Logo } from "../Icons/Logo";
import { useUser } from "@/lib/query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { loginAtom, modeAtom } from "@/lib/atoms";
import { useIsSmallScreen } from "./hooks";
import { Menu } from "@mui/icons-material";

export const AppBar = ({ handleOpenDrawer }) => {
  const user = useUser();
  const setLoginDialog = useSetRecoilState(loginAtom);
  const mode = useRecoilValue(modeAtom);
  const isSmallScreen = useIsSmallScreen();
  const theme = useTheme();
  return (
    <MuiAppBar
      position="sticky"
      sx={{ zIndex: { md: theme.zIndex.drawer + 1, sm: theme.zIndex.appBar } }}
    >
      <Toolbar>
        <Stack gap={2} direction="row">
          {isSmallScreen && user && (
            <IconButton aria-label="menu-button" onClick={handleOpenDrawer}>
              <Menu />
            </IconButton>
          )}
          <IconButton
            aria-label="logo"
            size="large"
            edge="start"
            sx={{ mr: 2 }}
            disabled
          >
            <Logo color={mode === "light" ? "black" : undefined} />
          </IconButton>
        </Stack>
        <Typography
          component="div"
          sx={{
            flexGrow: 1,
            whiteSpace: "nowrap",
            typography: { sm: "subtitle1", xs: "subtitle2" },
          }}
        >
          Crypto Tracker
        </Typography>
        <UserCircle openLogin={() => setLoginDialog(true)} />
      </Toolbar>
    </MuiAppBar>
  );
};
