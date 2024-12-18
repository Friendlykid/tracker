import { timestampToDate } from "@/lib/conversion";
import { useUser } from "@/lib/query";
import { useAddress } from "@/lib/useAddressQuery";
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";
import { useMemo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_HEIGHT = 400;

const dateFormatter = (date) => {
  return format(new Date(!date ? 0 : date), "dd/MMM");
};

const CustomTooltip = (props) => {
  const { active, payload } = props;
  if (active) {
    const currData = payload && payload.length ? payload[0].payload : null;
    return (
      <Box minHeight={10} minWidth={10}>
        <Typography>
          {currData
            ? format(new Date(currData?.time ?? 0), "HH:mm dd/MMM")
            : " -- "}
        </Typography>
        <Typography>
          {"Total balance : "}
          {currData ? currData?.balance : " -- "}
          {currData ? " BTC" : ""}
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
          {"Amount : "}
          {currData?.amount > 0 && "+"}
          {currData?.amount}
          {" BTC"}
        </Typography>
        {currData?.hash && (
          <Typography
            textOverflow="ellipsis"
            overflow="hidden"
            whiteSpace="nowrap"
            sx={{ maxWidth: 200 }}
          >
            {"Hash: "}
            {currData.hash}
          </Typography>
        )}
      </Box>
    );
  }
  return null;
};

export const BtcChart = ({ isRoot = false, sampleData = [] }) => {
  const { data, isFetched, isError } = useAddress();
  const user = useUser();
  const isOk = isFetched && !isError;
  const theme = useTheme();
  const chartData = useMemo(() => {
    if (!isOk) return [];
    const initPoint = {
      balance: data.initValue,
      time: data.time ? timestampToDate(data.time).getTime() : 0,
      amount: 0,
    };
    if (data.txs.length === 0) {
      return [initPoint, { ...initPoint, time: Date.now() }];
    }
    const txs = [initPoint, ...structuredClone(data.txs)]
      .map((tx) => ({ ...tx, time: timestampToDate(tx.time) }))
      .sort((a, b) => {
        return a.time - b.time;
      });

    let cumulativeBalance = initPoint.balance;
    const dataPoints = txs
      .filter((tx) => tx.amount !== "0")
      .map((tx) => {
        cumulativeBalance += parseFloat(tx.amount);
        return {
          time: tx.time.getTime(),
          balance: cumulativeBalance,
          amount: parseFloat(tx.amount),
          hash: tx.hash,
        };
      });
    dataPoints.push({
      time: Date.now(),
      balance: cumulativeBalance,
      amount: 0,
    });
    return dataPoints;
  }, [data, isOk]);
  if (!user && !isRoot) return null;
  return (
    <>
      {!isOk && !isRoot ? (
        <Skeleton variant="rectangular" width="100%" height={CHART_HEIGHT} />
      ) : (
        <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
          <LineChart data={isRoot ? sampleData : chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis tickCount={5} dataKey="time" tickFormatter={dateFormatter} />
            <YAxis domain={["auto", "auto"]} dataKey="balance" type="number" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              strokeWidth={2}
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
