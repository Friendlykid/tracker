import Layout from "@/components/Layout";
import { doSendEmailVerification } from "@/firebase/auth";
import { useUser } from "@/lib/query";
import { Button, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Verify() {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {}, [user, router]);
  return (
    <Layout>
      {!user?.verifiedEmail ? (
        <Stack alignItems="center" justifyContent="center" mt={4} gap={2}>
          <Typography>You are not verified!</Typography>
          <Button onClick={() => doSendEmailVerification()}>
            Send Verification Email
          </Button>
        </Stack>
      ) : (
        <Typography>You are verified!</Typography>
      )}
    </Layout>
  );
}
