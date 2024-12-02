import { loginAtom } from "@/lib/atoms";
import { percChange } from "@/lib/percentage";
import { useUser } from "@/lib/query";
import { Box, Button, Paper, Stack, Typography, useTheme } from "@mui/material";
import { blue, deepOrange } from "@mui/material/colors";
import { useRouter } from "next/router";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useSetRecoilState } from "recoil";

const data = [
  {
    date: new Date(new Date().setFullYear(2024, 1)),
    Ether: 1.5,
    USDC: 3.0,
  },
  {
    date: new Date(new Date().setFullYear(2024, 2)),
    Ether: 1.8,
    USDC: 5,
  },
  {
    date: new Date(new Date().setFullYear(2024, 3)),
    Ether: 2.0,
    USDC: 6,
  },
  {
    date: new Date(new Date().setFullYear(2024, 4)),
    Ether: 5.0,
    USDC: 7,
  },
  {
    date: new Date(new Date().setFullYear(2024, 5)),
    Ether: 2.1,
    USDC: 2,
  },
  {
    date: new Date(new Date().setFullYear(2024, 6)),
    Ether: 1.9,
    USDC: 6,
  },
  {
    date: new Date(new Date().setFullYear(2024, 7)),
    Ether: 2.3,
    USDC: 4,
  },
];

const CustomTooltip = ({ payload, active }) => {
  if (active && payload && payload.length) {
    return (
      <Box>
        {payload.map((load, i) => {
          const percentage = percChange(data[0][load.name], load.value);
          return (
            <Typography key={`${load.value}-${i}`}>
              {`${load.name} : ${load.value} `}
              <Typography
                component="span"
                color={
                  percentage === 0
                    ? "info"
                    : percentage > 0
                    ? "success"
                    : "error"
                }
              >{`(${percentage}%)`}</Typography>
            </Typography>
          );
        })}
      </Box>
    );
  }

  return null;
};

const HeroChart = () => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />

        <Tooltip content={CustomTooltip} />
        <Line
          strokeWidth={2}
          type="monotone"
          dataKey="Ether"
          stroke={deepOrange[500]}
        />
        <Line
          strokeWidth={2}
          type="monotone"
          dataKey="USDC"
          stroke={blue[500]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};
export const Hero = () => {
  const setLogin = useSetRecoilState(loginAtom);
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
          <HeroChart />
        </Paper>
      </Stack>
    </Box>
  );
};
