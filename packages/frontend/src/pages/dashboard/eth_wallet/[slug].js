import { EthChart } from "@/components/Chart/EthChart";
import { DeleteSubscriptionDialog } from "@/components/DeleteSubscriptionDialog";
import Layout from "@/components/Layout/Layout";
import { EthTable } from "@/components/Table/EthTable";
import { WalletSkeleton } from "@/components/WalletSkeleton";
import { COLLECTIONS } from "@/firebase/constants";
import { selectTokenAtom } from "@/lib/atoms";
import { ETHEREUM } from "@/lib/constants";
import { useDeleteSubscription } from "@/lib/mutations";
import { useUser } from "@/lib/query";
import { useAddress } from "@/lib/useAddressQuery";
import { ContentCopy, Delete, Edit } from "@mui/icons-material";
import {
  Button,
  Divider,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import { enqueueSnackbar } from "notistack";
import { useMemo, useState } from "react";
import { useRecoilState } from "recoil";

const sortTokens = (tokens) =>
  Object.keys(tokens).sort((a, b) => {
    if (!tokens[a].includes("0x") && tokens[b].includes("0x")) return -1;
    if (tokens[a].includes("0x") && !tokens[b].includes("0x")) return 1;

    // If both are of the same type, sort lexicographically
    return a.localeCompare(b);
  });

export default function EthWallet() {
  const user = useUser();
  const { data, isFetched, isError } = useAddress();
  const isOk = useMemo(() => isFetched && !isError, [isFetched, isError]);
  const router = useRouter();
  const [selectedToken, setSelectedToken] = useRecoilState(selectTokenAtom);
  const { mutate: deleteSubscription } = useDeleteSubscription();
  const [openDialog, setOpenDialog] = useState(false);
  const tokenList = useMemo(() => {
    const tokens = { [ETHEREUM]: "ETH" };
    if (!isOk || !data.tokens) return tokens;
    data.tokens.forEach((token) => {
      tokens[token.contractAddr] = token.symbol ?? token.contractAddr;
    });
    data.txs
      .filter((tx) => {
        return tx.contractAddress;
      })
      .forEach((tx) => {
        tokens[tx.contractAddress] = tx.symbol ?? tx.contractAddress;
      });
    return tokens;
  }, [data, isOk]);

  if (!user) return null;
  return (
    <Layout title="Eth Wallet">
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
            <Button
              startIcon={<Edit />}
              onClick={() =>
                router.push(
                  `/dashboard/eth_wallet/edit/${router.asPath.split("/").pop()}`
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
          <EthChart />
          {tokenList && (
            <TextField
              select
              aria-label="select"
              name="select"
              value={selectedToken}
              label="Select token to visualise"
              onChange={(event) => {
                setSelectedToken(event.target.value);
              }}
              slotProps={{ inputLabel: { component: "span" } }}
            >
              {sortTokens(tokenList).map((contractAddr) => (
                <MenuItem key={contractAddr} value={contractAddr}>
                  {tokenList[contractAddr]}
                </MenuItem>
              ))}
            </TextField>
          )}
          <Typography variant="h4">Transactions</Typography>
          <EthTable />
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
