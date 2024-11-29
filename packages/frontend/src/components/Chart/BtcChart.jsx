import { timestampToDate } from "@/lib/conversion";
import { useUser } from "@/lib/query";
import { useAddress } from "@/lib/useAddressQuery";
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";
import { useMemo } from "react";
import {
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_HEIGHT = 400;

const CustomTooltip = (props) => {
  const { active, payload } = props;
  if (active) {
    const currData = payload && payload.length ? payload[0].payload : null;
    return (
      <Box minHeight={10} minWidth={10}>
        <Typography>
          {currData ? format(new Date(currData?.time), "yyyy-MM-dd") : " -- "}
        </Typography>
        <Typography>
          {"balance : "}
          {currData ? currData?.balance : " -- "}
        </Typography>
        <Typography
          color={
            currData?.amount >= 0
              ? currData?.amount === 0
                ? "info"
                : "success"
              : "error"
          }
        >
          {"amount : "}
          {currData?.amount}
          {" BTC"}
        </Typography>
      </Box>
    );
  }

  return null;
};

const dateFormatter = (date) => {
  return format(new Date(date), "dd/MMM");
};

export const BtcChart = () => {
  const { data, isFetched, isError } = useAddress();
  const user = useUser();
  const isOk = isFetched && !isError;
  const theme = useTheme();
  const chartData = useMemo(() => {
    if (!isOk) return [];
    const initPoint = {
      balance: data.initValue,
      time: data.time ?? 0,
      amount: 0,
    };
    if (data.txs.length === 0) {
      return [initPoint, { ...initPoint, time: Date.now() }];
    }
    const txs = [
      { balance: data.initValue, time: data.time ?? 0, amount: 0 },
      ...structuredClone(data.txs),
    ]
      .map((tx) => ({ ...tx, time: timestampToDate(tx.time) }))
      .sort((a, b) => {
        return a.time - b.time;
      });

    let cumulativeBalance = data.initValue;
    const dataPoints = txs
      .filter((tx) => tx.amount !== "0")
      .map((tx) => {
        cumulativeBalance += parseFloat(tx.amount);
        return {
          time: tx.time.getTime(),
          balance: cumulativeBalance,
          amount: parseFloat(tx.amount),
        };
      });
    dataPoints.push({
      time: Date.now(),
      balance: cumulativeBalance,
      amount: 0,
    });
    return dataPoints;
  }, [data, isOk]);

  if (!user) return null;
  return (
    <>
      {!isOk ? (
        <Skeleton variant="rectangular" width="100%" height={CHART_HEIGHT} />
      ) : (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={chartData}>
            <XAxis tickCount={5} dataKey="time" tickFormatter={dateFormatter} />
            <YAxis domain={["auto", "auto"]} dataKey="balance" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="balance"
              stroke={theme.palette.primary.dark}
              dot={chartData.length < 30}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};