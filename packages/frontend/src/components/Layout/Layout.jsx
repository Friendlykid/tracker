import { Box, CssBaseline, Drawer, styled } from "@mui/material";
import { useEffect, useState } from "react";
import Login from "../LoginDialog";
import { useUser } from "@/lib/query";
import { useRouter } from "next/router";
import Head from "next/head";
import { AppBar } from "./AppBar";
import { useIsSmallScreen } from "./hooks";
import { DrawerContent } from "./DrawerContent";

const DRAWER_WIDTH = 280;

const MainStyle = styled("main")(({ theme }) => {
  const router = useRouter();
  return {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 24,
    width: router.asPath === "/" ? "100%" : `calc(100% - ${DRAWER_WIDTH}px)`,
    [theme.breakpoints.up("xs")]: {
      paddingLeft: 25,
      paddingRight: 25,
    },
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: 24,
      paddingBottom: 24,
    },
    [theme.breakpoints.up("sm")]: {
      marginLeft: router.asPath === "/" ? 0 : DRAWER_WIDTH,
    },
  };
});

const Layout = ({ children, title }) => {
  const router = useRouter();
  const user = useUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const isSmallScreen = useIsSmallScreen();
  useEffect(() => {
    if (!user && router.asPath !== "/") {
      router.push("/");
    } else if (user && !user.emailVerified && router.asPath !== "/verify") {
      router.push("/verify");
    }
  }, [user, router]);
  return (
    <Box>
      <CssBaseline />
      <Head>
        <title>
          {title ? `Crypto adress watch - ${title}` : "Crypto adress watch"}
        </title>
      </Head>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <AppBar
          handleOpenDrawer={() => {
            setIsDrawerOpen(true);
          }}
        />

        {user?.emailVerified && router.asPath !== "/" && (
          <Drawer
            variant={isSmallScreen ? "temporary" : "permanent"}
            open={isSmallScreen ? isDrawerOpen : true}
            onClose={() => {
              setIsDrawerOpen(false);
            }}
            sx={{
              flexShrink: 0,
              width: DRAWER_WIDTH,
              [`& .MuiDrawer-paper`]: {
                width: DRAWER_WIDTH,
                boxSizing: "border-box",
                marginTop: { sm: 8 },
                height: { sm: `calc(100% - 64px)` },
              },
            }}
          >
            <DrawerContent />
          </Drawer>
        )}
        <MainStyle>{children}</MainStyle>
      </Box>
      <Login />
    </Box>
  );
};

export default Layout;
