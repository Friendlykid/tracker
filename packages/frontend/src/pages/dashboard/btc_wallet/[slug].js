import Layout from "@/components/Layout/Layout";
import { WalletSkeleton } from "@/components/WalletSkeleton";
import { useAddress, useUser } from "@/lib/query";
import { Edit } from "@mui/icons-material";
import {
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default function BtcWallet() {
  const user = useUser();
  const { data, isFetched } = useAddress();
  if (isFetched) console.log(data);
  if (!user) return null;
  console.log(data);

  return (
    <Layout title="Btc Wallet">
      {!isFetched ? (
        <WalletSkeleton />
      ) : (
        <Stack>
          <Typography variant="h2">{data.name}</Typography>
          {data.name !== data.address && (
            <Typography variant="h4">{data.address}</Typography>
          )}
          <Divider />
          <Stack direction="row" justifyContent="space-between">
            <Button startIcon={<Edit />}>Edit subscription</Button>
            <Button disabled>Delete subscription</Button>
          </Stack>

          {/*Chart*/}

          <Typography variant="h4">Transactions</Typography>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Hash</TableCell>
                  <TableCell>Block Height</TableCell>
                  <TableCell>Time</TableCell>
                  <TableCell>Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {!data?.txs || data?.txs?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography>No new transactions</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  [...Array(2)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>Hello</TableCell>
                      <TableCell>Hello</TableCell>
                      <TableCell>Hello </TableCell>
                      <TableCell>Hello </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      )}
    </Layout>
  );
}
