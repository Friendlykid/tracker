import Layout from "@/components/Layout";
import Login from "@/components/Login";
import SwitchTheme from "@/components/SwitchTheme";
import Todo from "@/components/Todo";
import { auth } from "@/firebase/firebase";
import { useHealth } from "@/lib/query";
import { Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Layout>
      <Stack justifyContent="center" alignItems="center" mt={10}>
        <Stack justifyContent="center" alignItems="center" gap={1}>
          <Login />

          <Typography variant="h4">TODO list</Typography>
          {auth.currentUser && <Todo />}
          <Typography>Dark mode </Typography>
          <SwitchTheme />
        </Stack>
      </Stack>
    </Layout>
  );
}
