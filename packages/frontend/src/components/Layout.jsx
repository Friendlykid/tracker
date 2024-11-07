import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { auth } from "@/firebase/firebase";
import { useState } from "react";
import Login from "./Login";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SwitchTheme from "./SwitchTheme";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/lib/recoilProvider";

const Layout = ({ children }) => {
  const user = useRecoilValue(userAtom);
  const [loginOpen, setLoginOpen] = useState(false);
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Appka
            </Typography>
            <SwitchTheme />
            {user ? (
              <IconButton>
                <AccountCircle />
              </IconButton>
            ) : (
              <Button color="inherit" onClick={() => setLoginOpen(true)}>
                Log in
              </Button>
            )}
          </Toolbar>
        </AppBar>
        <main>{children}</main>
      </Box>
      <Login open={loginOpen} handleClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Layout;
