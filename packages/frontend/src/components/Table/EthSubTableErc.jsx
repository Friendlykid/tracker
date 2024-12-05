import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

export const EthSubTableErc = ({ internalTxs }) => {
  return (
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
            <TableCell component="th" scope="row" title={internal.logIndex}>
              {internal.logIndex}
            </TableCell>
            <TableCell component="th" scope="row" title={internal.from}>
              {internal.from}
            </TableCell>
            <TableCell component="th" scope="row" title={internal.to}>
              {internal.to}
            </TableCell>
            <TableCell component="th" scope="row" title={internal.amount}>
              {internal.amount}
            </TableCell>
            <TableCell
              component="th"
              scope="row"
              title={internal.contractAddress}
            >
              {internal.tokenName
                ? `${internal.tokenName} ${internal.symbol}`
                : internal.contractAddress}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
