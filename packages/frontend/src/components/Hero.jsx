import { loginAtom } from "@/lib/atoms";
import { useRandomChartQuery, useUser } from "@/lib/query";
import {
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { BtcChart } from "./Chart/BtcChart";

export const Hero = () => {
  const setLogin = useSetRecoilState(loginAtom);
  const { data, isFetched } = useRandomChartQuery();
  const user = useUser();
  const router = useRouter();
  const theme = useTheme();
  return (
    <Box justifyItems="center" alignItems="center">
      <Stack gap={4} alignItems="center">
        <Paper elevation={4} sx={{ maxWidth: 700 }}>
          <Stack spacing={4} p={2} alignItems="center" justifyContent="center">
            <Typography variant="h3" textAlign="center">
              <Typography variant="inherit" color="primary" component="span">
                Track
              </Typography>
              {" and "}
              <Typography variant="inherit" color="primary" component="span">
                Visualize
              </Typography>
              {"  Cryptocurrency Activity Effortlessly!"}
            </Typography>
            <Typography textAlign="center">
              Monitor any Bitcoin or Ethereum wallet with ease. Stay informed
              with real-time updates on balance changes and visualize
              transactions through intuitive, interactive charts and get
              notified through email.
            </Typography>
            <Button
              variant="contained"
              color={theme.palette.mode === "light" ? "secondary" : "primary"}
              sx={{ maxWidth: 200 }}
              onClick={() => {
                if (user) {
                  router.push("/dashboard/new");
                } else {
                  setLogin(true);
                }
              }}
            >
              Get Started
            </Button>
          </Stack>
        </Paper>
        <Paper
          sx={{
            width: { xs: "100%", md: 900 },
            height: { xs: 300, md: 500 },
            p: 2,
          }}
          p={2}
          elevation={6}
        >
          {!isFetched ? (
            <Skeleton variant="rectangular" width="100%" height="100%" />
          ) : (
            <Stack alignItems="center" gap={2}>
              <Typography variant="h4">
                Sample visualization of Coincheck exchange
              </Typography>
              <BtcChart isRoot sampleData={data} />
            </Stack>
          )}
        </Paper>
      </Stack>
    </Box>
  );
};
