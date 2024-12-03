import { BtcChart } from "@/components/Chart/BtcChart";
import Layout from "@/components/Layout/Layout";
import { BtcTable } from "@/components/Table/BtcTable";
import { WalletSkeleton } from "@/components/WalletSkeleton";
import { useUser } from "@/lib/query";
import { useAddress } from "@/lib/useAddressQuery";
import { Delete, Edit } from "@mui/icons-material";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { enqueueSnackbar } from "notistack";
import { useRouter } from "next/router";
import { useDeleteSubscription } from "@/lib/mutations";
import { COLLECTIONS } from "@/firebase/constants";
import { DeleteSubscriptionDialog } from "@/components/DeleteSubscriptionDialog";
export default function BtcWallet() {
  const user = useUser();
  const { data, isFetched, isError } = useAddress();
  const isOk = useMemo(() => isFetched && !isError, [isFetched, isError]);
  const { mutate: deleteSubscription } = useDeleteSubscription();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);
  if (!user) return null;
  return (
    <Layout title="Btc Wallet">
      {!isOk ? (
        <WalletSkeleton />
      ) : (
        <Stack gap={2}>
          <Typography textOverflow="ellipsis" overflow="hidden" variant="h2">
            {data.name}
          </Typography>
          <Stack direction="row">
            <IconButton
              title="Copy to Clipboard"
              onClick={() => {
                enqueueSnackbar("Copied to Clipboard", { variant: "info" });
                navigator.clipboard.writeText(data.address);
              }}
            >
              <ContentCopy />
            </IconButton>
            <Typography
              variant="h4"
              component="h3"
              textOverflow="ellipsis"
              overflow="hidden"
            >
              {data.address}
            </Typography>
          </Stack>

          <Divider />
          <Stack direction="row" justifyContent="space-between" mb={4}>
            <Button
              startIcon={<Edit />}
              onClick={() =>
                router.push(
                  `/dashboard/btc_wallet/edit/${router.asPath.split("/").pop()}`
                )
              }
            >
              Edit subscription
            </Button>
            <Button
              startIcon={<Delete />}
              color="error"
              onClick={() => {
                setOpenDialog(true);
              }}
            >
              Delete subscription
            </Button>
          </Stack>
          <BtcChart />
          <Typography variant="h4">Transactions</Typography>
          <BtcTable />
        </Stack>
      )}
      <DeleteSubscriptionDialog
        open={openDialog}
        handleClose={() => setOpenDialog(false)}
        action={() => {
          if (!isOk) return;
          deleteSubscription({
            coll: router.asPath.includes("btc_wallet")
              ? COLLECTIONS.BTC_SUBSCRIPTIONS(user.uid)
              : COLLECTIONS.ETH_SUBSCRIPTIONS(user.uid),
            addr: router.asPath.split("/").pop(),
          });
        }}
      />
    </Layout>
  );
}
