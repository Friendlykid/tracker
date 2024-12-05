import { ETHEREUM } from "@/lib/constants";
import { getRandomFirestoreTimestamp, timestampToDate } from "@/lib/conversion";
import { useUser } from "@/lib/query";
import { useAddress } from "@/lib/useAddressQuery";
import { Box, Skeleton, Typography, useTheme } from "@mui/material";
import { format } from "date-fns";
import NumberAbbreviate from "number-abbreviate";
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

const formatTicks = (value) => {
  // eslint-disable-next-line no-undef
  return new Intl.NumberFormat("en-US", { notation: "scientific" }).format(
    value
  );
};

const formatTooltip = (value) => {
  return new NumberAbbreviate().abbreviate(parseFloat(value), 2);
};

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
          {"Total balance : "}
          {currData ? formatTooltip(currData?.balance) : " -- "}
          {currData?.symbol && ` ${currData.symbol}`}
        </Typography>
        {!currData.noAmount && (
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
            {currData?.symbol && ` ${currData.symbol}`}
          </Typography>
        )}
        {currData.hash && (
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

const dateFormatter = (date) => {
  return format(new Date(date === "" ? 0 : date), "dd/MMM");
};

export const EthChart = ({ selectedToken }) => {
  const { data, isFetched, isError } = useAddress();
  const user = useUser();
  const isOk = isFetched && !isError;
  const theme = useTheme();
  const chartData = useMemo(() => {
    if (!isOk || !data.txs) return [];
    if (selectedToken === ETHEREUM) {
      let cumulativeBalance = parseFloat(data.initValue);
      const etherTx = data.txs
        .filter((tx) => tx.symbol === "ETH")
        .map((tx) => {
          const time = tx.time ?? getRandomFirestoreTimestamp();
          return {
            amount: tx.amount,
            time: timestampToDate(time)?.getTime(),
            hash: tx.hash,
            symbol: tx.symbol,
          };
        })
        .sort((a, b) => {
          return a.time - b.time;
        })
        .map(({ amount, ...other }) => {
          cumulativeBalance += parseFloat(amount);
          return { balance: cumulativeBalance, amount, ...other };
        });
      return [
        {
          balance: parseFloat(data.initValue),
          time: timestampToDate(data.time)?.getTime() ?? 0,
          noAmount: true,
        },
        ...(etherTx.length !== 0
          ? etherTx
          : [
              {
                balance: parseFloat(data.initValue),
                time: Date.now(),
                noAmount: true,
              },
            ]),
      ];
    }

    const initPoint = {
      balance:
        data.tokens.find((token) => token.contractAddr === selectedToken)
          ?.amount ?? 0,
      time: timestampToDate(data.time)?.getTime(),
      amount: 0,
      noAmount: true,
      symbol: data.tokens.find((token) => token.contractAddr === selectedToken)
        ?.symbol,
    };
    const transactionsWithTokens = data.txs.filter((tx) => {
      return tx.contractAddress === selectedToken;
    });
    if (transactionsWithTokens.length === 0) {
      return [initPoint, { ...initPoint, time: Date.now() }];
    }
    transactionsWithTokens
      .map((tx) => ({
        ...tx,
        time: timestampToDate(tx.time).getTime(),
      }))
      .sort((a, b) => {
        return a.time - b.time;
      });
    let cumulativeBalance = parseFloat(initPoint.balance);
    const dataPoints = transactionsWithTokens
      .filter((tx) => tx.amount !== "0")
      .map((tx) => {
        cumulativeBalance += parseFloat(tx.amount);
        return {
          time: tx.time
            ? timestampToDate(tx.time).getTime()
            : timestampToDate().getTime(),
          balance: cumulativeBalance,
          amount: parseFloat(tx.amount),
          hash: tx.hash,
          symbol: tx?.symbol,
        };
      });
    dataPoints.push({
      time: Date.now(),
      balance: cumulativeBalance,
      amount: 0,
      noAmount: true,
      symbol: initPoint?.symbol,
    });
    return [initPoint, ...dataPoints];
  }, [data, isOk, selectedToken]);
  const ticks = useMemo(() => {
    return chartData.every((dataPoint) => {
      return dataPoint.balance === chartData[0].balance;
    })
      ? [chartData[0].balance]
      : undefined;
  }, [chartData]);

  if (!user) return null;
  return (
    <>
      {!isOk ? (
        <Skeleton variant="rectangular" width="100%" height={CHART_HEIGHT} />
      ) : (
        <ResponsiveContainer
          width="100%"
          height={CHART_HEIGHT}
          style={{ marginRight: -15 }}
        >
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              tickCount={5}
              dataKey="time"
              tickFormatter={dateFormatter}
              tick={{ fontSize: 12, dy: 15 }}
            />
            <YAxis
              domain={["auto", "auto"]}
              type="number"
              dataKey="balance"
              tickFormatter={(value) => formatTicks(value)}
              ticks={ticks}
              tick={{ fontSize: 12, dy: 5 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              strokeWidth={2}
              type="monotone"
              dataKey="balance"
              stroke={theme.palette.secondary.light}
              dot={chartData.length < 30}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};
