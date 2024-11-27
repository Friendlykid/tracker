import Layout from "@/components/Layout/Layout";
import { doSendEmailVerification } from "@/firebase/auth";
import { useUser } from "@/lib/query";
import { Button, Skeleton, Stack, Typography } from "@mui/material";

export default function Verify() {
  const user = useUser();

  return (
    <Layout title="Verification">
      {!user ? (
        <Skeleton variant="rectangular" width={300} />
      ) : !user?.verifiedEmail ? (
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
