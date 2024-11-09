import Layout from "@/components/Layout";
import Login from "@/components/LoginDialog";
import SwitchTheme from "@/components/SwitchTheme";
import Todo from "@/components/Todo";
import { auth } from "@/firebase/firebase";
import { Stack, Typography } from "@mui/material";

export default function Home() {
  return (
    <Layout>
      <Stack justifyContent="center" alignItems="center" mt={10}>
        <Stack justifyContent="center" alignItems="center" gap={1}>
          <Login />
        </Stack>
      </Stack>
    </Layout>
  );
}
