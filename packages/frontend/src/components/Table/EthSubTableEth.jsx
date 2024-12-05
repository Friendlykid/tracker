import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export const EthSubTableEth = ({ from, to, amount }) => {
  return (
    <Table size="small" aria-label="internal tx">
      <TableHead>
        <TableRow>
          <TableCell>From</TableCell>
          <TableCell>To</TableCell>
          <TableCell>Amount</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow
          sx={{
            "& > *": {
              overflow: "hidden",
              textOverflow: "ellipsis",
              maxWidth: 100,
              borderBottom: "none",
            },
          }}
        >
          <TableCell component="th" scope="row" title="From">
            {from}
          </TableCell>
          <TableCell component="th" scope="row" to="To">
            {to}
          </TableCell>
          <TableCell component="th" scope="row" title="amount">
            {amount}
            {" ETH"}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
