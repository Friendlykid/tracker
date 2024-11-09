import {
  AppBar,
  Box,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import Login from "./LoginDialog";
import SwitchTheme from "./SwitchTheme";
import { UserCircle } from "./UserCircle";
import { useUser } from "@/lib/query";
import { useRouter } from "next/router";

export const MainStyle = styled("main")(({ theme }) => {
  return {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 24,
    width: "100%",
    [theme.breakpoints.up("xs")]: {
      paddingLeft: 25,
      paddingRight: 25,
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: 24,
      paddingBottom: 24,
    },
  };
});

const Layout = ({ children }) => {
  const [loginOpen, setLoginOpen] = useState(false);
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!user && router.asPath !== "/") {
      router.push("/");
    } else if (user && !user.emailVerified && router.asPath !== "/verify") {
      router.push("/verify");
    } else if (user && router.asPath === "/") {
      router.push("/dashboard");
    }
  }, [user, router]);
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
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
            <UserCircle openLogin={() => setLoginOpen(true)} />
          </Toolbar>
        </AppBar>

        <MainStyle>{children}</MainStyle>
      </Box>
      <Login open={loginOpen} handleClose={() => setLoginOpen(false)} />
    </>
  );
};

export default Layout;
