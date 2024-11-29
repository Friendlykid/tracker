import { useUser } from "@/lib/query";
import { useAddress } from "@/lib/useAddressQuery";
import { LineChart, ResponsiveContainer } from "recharts";

export const Chart = () => {
  const { data, isFetched } = useAddress();
  const user = useUser();
  if (!user) return null;

  return (
    <>
      {!isFetched ? (
        <>asfns</>
      ) : (
        <ResponsiveContainer width="100%" minWidth={200} height={300}>
          <LineChart></LineChart>
        </ResponsiveContainer>
      )}
    </>
  );
};
