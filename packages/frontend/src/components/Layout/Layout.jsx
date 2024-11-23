import { Box, Drawer, styled, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import Login from "../LoginDialog";
import { useUser } from "@/lib/query";
import { useRouter } from "next/router";
import Head from "next/head";
import { AppBar } from "./AppBar";
import { useIsSmallScreen } from "./hooks";
import { DrawerContent } from "./DrawerContent";

const DRAWER_WIDTH = 240;

const MainStyle = styled("main")(({ theme }) => {
  return {
    flexGrow: 1,
    paddingTop: 24,
    paddingBottom: 24,
    width: `calc(100% - ${DRAWER_WIDTH}px)`,
    [theme.breakpoints.up("xs")]: {
      paddingLeft: 25,
      paddingRight: 25,
    },
    [theme.breakpoints.up("md")]: {
      paddingTop: 24,
      paddingBottom: 24,
    },
    [theme.breakpoints.up("sm")]: {
      marginLeft: DRAWER_WIDTH,
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
    } else if (user && router.asPath === "/") {
      router.push("/dashboard");
    }
  }, [user, router]);
  return (
    <>
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

        {user.emailVerified && (
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
    </>
  );
};

export default Layout;
