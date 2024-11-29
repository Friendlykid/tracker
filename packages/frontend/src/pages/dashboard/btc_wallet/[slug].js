import { BtcChart } from "@/components/Chart/BtcChart";
import Layout from "@/components/Layout/Layout";
import { BtcTable } from "@/components/Table/BtcTable";
import { WalletSkeleton } from "@/components/WalletSkeleton";
import { useUser } from "@/lib/query";
import { useAddress } from "@/lib/useAddressQuery";
import { Edit } from "@mui/icons-material";
import { Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { enqueueSnackbar } from "notistack";
export default function BtcWallet() {
  const user = useUser();
  const { data, isFetched, isError } = useAddress();
  const isOk = useMemo(() => isFetched && !isError, [isFetched, isError]);

  if (!user) return null;
  return (
    <Layout title="Btc Wallet">
      {!isOk ? (
        <WalletSkeleton />
      ) : (
        <Stack gap={2}>
          <Typography variant="h2">{data.name}</Typography>
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
            {data.name !== data.address && (
              <Typography
                variant="h4"
                textOverflow="ellipsis"
                overflow="hidden"
              >
                {data.address}
              </Typography>
            )}
          </Stack>

          <Divider />
          <Stack direction="row" justifyContent="space-between" mb={4}>
            <Button startIcon={<Edit />}>Edit subscription</Button>
            <Button disabled>Delete subscription</Button>
          </Stack>
          <BtcChart />
          <Typography variant="h4">Transactions</Typography>
          <BtcTable />
        </Stack>
      )}
    </Layout>
  );
}
