import { Box, styled } from "@mui/material";
import { useEffect } from "react";
import Login from "../LoginDialog";
import { useUser } from "@/lib/query";
import { useRouter } from "next/router";
import Head from "next/head";
import { AppBar } from "./AppBar";

const MainStyle = styled("main")(({ theme }) => {
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

const Layout = ({ children, title }) => {
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
        <AppBar />
        <Head>
          <title>
            {title ? `Crypto adress watch - ${title}` : "Crypto adress watch"}
          </title>
        </Head>
        <MainStyle>{children}</MainStyle>
      </Box>
      <Login />
    </>
  );
};

export default Layout;
