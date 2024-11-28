import {
  Button,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

export const WalletSkeleton = () => {
  return (
    <Stack>
      <Skeleton variant="text" height={100} />
      <Divider />
      <Stack direction="row" justifyContent="space-between">
        <Button disabled>
          <Skeleton variant="rounded" width={150} />
        </Button>
        <Button disabled>
          <Skeleton variant="rounded" width={150} />
        </Button>
      </Stack>

      <Skeleton width="100%" height={400} />

      <Skeleton variant="text" height={100} />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Skeleton width="120px" />
              </TableCell>
              <TableCell>
                <Skeleton width="120px" />
              </TableCell>
              <TableCell>
                <Skeleton width="120px" />
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[...Array(2)].map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton width="200px" />
                </TableCell>
                <TableCell>
                  <Skeleton width="100px" />
                </TableCell>
                <TableCell>
                  <Skeleton width="150px" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
