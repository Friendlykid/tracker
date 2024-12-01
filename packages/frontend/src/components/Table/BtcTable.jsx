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

const Row = ({ hash, block_height, time, amount, inputs, outs }) => {
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
            href={`https://www.blockchain.com/explorer/transactions/btc/${hash}`}
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
          {block_height}
        </TableCell>
        <TableCell>
          {format(timestampToDate(time), "dd/MM/yy HH:mm") ?? "---"}{" "}
        </TableCell>
        <TableCell
          sx={{
            maxWidth: 100,
          }}
        >
          {amount}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Stack direction="row">
              <Table
                size="small"
                aria-label="inputs"
                sx={{ width: "50%", tableLayout: "fixed" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>From</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(inputs).map((inputAddr) => (
                    <TableRow
                      key={inputAddr}
                      sx={{ verticalAlign: "baseline" }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 100,
                        }}
                        title={inputAddr}
                      >
                        {inputAddr}
                      </TableCell>
                      <TableCell>{inputs[inputAddr]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Table
                size="small"
                aria-label="outs"
                sx={{ width: "50%", tableLayout: "fixed" }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>To</TableCell>
                    <TableCell>Amount</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.keys(outs).map((outAddr) => (
                    <TableRow key={outAddr} sx={{ verticalAlign: "baseline" }}>
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: 100,
                        }}
                        title={outAddr}
                      >
                        {outAddr}
                      </TableCell>
                      <TableCell>{outs[outAddr]}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Stack>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export const BtcTable = () => {
  const user = useUser();
  const { data, isFetched, isError } = useAddress();
  const isOk = useMemo(() => isFetched && !isError, [isFetched, isError]);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  if (!user) return null;
  return (
    <Stack>
      <Button
        sx={{ width: "fit-content", mb: 2 }}
        disabled={!isOk || data.txs.length === 0}
        onClick={() => {
          saveJSON(data.txs);
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
              <TableCell>Block Height</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!isOk || !data?.txs || data?.txs?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography>No transactions recorded yet</Typography>
                </TableCell>
              </TableRow>
            ) : (
              (rowsPerPage > 0
                ? data.txs
                    .sort((a, b) => b.block_height - a.block_height)
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                : data.txs
              ).map((tx) => (
                <Row
                  key={tx.hash}
                  amount={tx.amount}
                  block_height={tx.block_height}
                  hash={tx.hash}
                  time={tx.time}
                  inputs={tx.inputs}
                  outs={tx.outs}
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
        ></TablePagination>
      )}
    </Stack>
  );
};
