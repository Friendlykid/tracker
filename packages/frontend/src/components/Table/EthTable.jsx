import { timestampToDate } from "@/lib/conversion";
import { saveJSON } from "@/lib/export";
import { useUser } from "@/lib/query";
import { useAddress } from "@/lib/useAddressQuery";
import {
  FileDownload,
  KeyboardArrowDown,
  KeyboardArrowUp,
} from "@mui/icons-material";
import {
  Button,
  Collapse,
  IconButton,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { EthSubTableErc } from "./EthSubTableErc";
import { EthSubTableEth } from "./EthSubTableEth";
import { useRouter } from "next/router";

const Row = ({
  hash,
  amount,
  blockNumber,
  time,
  internalTxs = [],
  to,
  from,
  symbol,
}) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell sx={{ maxWidth: 40 }}>
          <IconButton
            aria-label="expand row"
            title="Show more"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>

        <TableCell
          sx={{
            maxWidth: 150,
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          title={hash}
        >
          <Link
            href={`https://etherscan.io/tx/${hash}`}
            target="_blank"
            rel="noopener"
            color="secondary"
          >
            {hash}
          </Link>
        </TableCell>
        <TableCell
          sx={{
            maxWidth: 50,
          }}
        >
          {blockNumber}
        </TableCell>
        <TableCell>
          {format(timestampToDate(time), "dd/MM/yy HH:mm") ?? "---"}
        </TableCell>
        <TableCell
          title={amount}
          sx={{
            maxWidth: 100,
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
        >
          {amount === "0x0" ? "---" : amount}
        </TableCell>
      </TableRow>

      <TableRow sx={{ borderBottom: "none" }}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Stack>
              {internalTxs.length > 0 && (
                <EthSubTableErc internalTxs={internalTxs} />
              )}
              {symbol === "ETH" && (
                <EthSubTableEth amount={amount} from={from} to={to} />
              )}
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const EthTable = () => {
  const user = useUser();
  const router = useRouter();
  const { data, isFetched, isError } = useAddress();
  const isOk = useMemo(() => isFetched && !isError, [isFetched, isError]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const tableData = useMemo(() => {
    if (!isOk) return [];
    return data.txs.reduce((acc, tx) => {
      if (tx.hash.includes("-")) {
        // is internal tx
        const existingTx = acc.find(
          (accTx) => accTx.hash === tx.hash.split("-")[0]
        );
        if (existingTx) {
          existingTx.internalTxs = existingTx.internalTxs
            ? [
                ...existingTx.internalTxs,
                { ...tx, logIndex: tx.hash.split("-")[1] },
              ]
            : [{ ...tx, logIndex: tx.hash.split("-")[1] }];
        } else {
          acc.push({
            ...tx,
            hash: tx.hash.split("-")[0],
            amount: "0x0",
            internalTxs: [{ ...tx, logIndex: tx.hash.split("-")[1] }],
          });
        }
      } else {
        acc.push(tx);
      }
      return acc;
    }, []);
  }, [data, isOk]);

  useEffect(() => {
    setPage(0);
  }, [router.asPath]);

  if (!user) return null;
  return (
    <Stack>
      <Button
        sx={{ width: "fit-content", mb: 2 }}
        disabled={!isOk || tableData.length === 0}
        onClick={() => {
          saveJSON(tableData);
        }}
        startIcon={<FileDownload />}
      >
        Export
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Hash</TableCell>
              <TableCell>Block Number</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Eth Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isOk || !tableData || tableData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography>No transactions recorded yet</Typography>
                </TableCell>
              </TableRow>
            ) : (
              (rowsPerPage > 0
                ? tableData
                    .sort((a, b) => b.blockNumber - a.blockNumber)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : tableData
              ).map((tx) => (
                <Row
                  key={tx.hash}
                  amount={tx.amount}
                  blockNumber={tx.blockNumber}
                  hash={tx.hash}
                  time={tx.time}
                  internalTxs={tx.internalTxs}
                  from={tx.from}
                  to={tx.to}
                  symbol={tx.symbol}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {data.txs.length > 0 && (
        <TablePagination
          component={Paper}
          count={data.txs.length}
          page={page}
          rowsPerPageOptions={[5, 10, 20, 50]}
          onPageChange={(_, newPage) => {
            setPage(newPage);
          }}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(1);
          }}
        />
      )}
    </Stack>
  );
};
