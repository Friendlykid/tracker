import {
  AppBar as MuiAppBar,
  IconButton,
  Toolbar,
  Typography,
  Stack,
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
  return (
    <MuiAppBar position="sticky">
      <Toolbar>
        <Stack gap={2} direction="row">
          {isSmallScreen && user && (
            <IconButton onClick={handleOpenDrawer}>
              <Menu />
            </IconButton>
          )}
          <IconButton
            size="large"
            edge="start"
            color="inherit"
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
