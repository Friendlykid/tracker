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
import { useMemo, useState } from "react";

const Row = ({ hash, amount, blockNumber, time, internalTxs = [] }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell sx={{ maxWidth: 40 }}>
          {internalTxs.length > 0 && (
            <IconButton
              aria-label="expand row"
              title="Show more"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
            </IconButton>
          )}
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
      {internalTxs.length > 0 && (
        <TableRow sx={{ borderBottom: "none" }}>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Stack>
                <Table size="small" aria-label="internal tx">
                  <TableHead>
                    <TableRow>
                      <TableCell>Log Index</TableCell>
                      <TableCell>From</TableCell>
                      <TableCell>To</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Contract Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {internalTxs.map((internal) => (
                      <TableRow
                        key={internal.logIndex}
                        sx={{
                          "& > *": {
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            maxWidth: 100,
                            borderBottom: "none",
                          },
                        }}
                      >
                        <TableCell
                          component="th"
                          scope="row"
                          title={internal.logIndex}
                        >
                          {internal.logIndex}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {internal.from}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {internal.to}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {internal.amount}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          {internal.tokenName
                            ? `${internal.tokenName} ${internal.symbol}`
                            : internal.contractAddress}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Stack>
            </Collapse>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export const EthTable = () => {
  const user = useUser();
  const { data, isFetched, isError } = useAddress();
  const isOk = useMemo(() => isFetched && !isError, [isFetched, isError]);
  const [page, setPage] = useState(1);
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
