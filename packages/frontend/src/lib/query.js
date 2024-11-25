import { auth } from "@/firebase/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export const useLastVisitedQuery = () => {
  return useQuery({
    queryKey: ["lastVisited"],
    enabled: false,
  });
};

export const useUser = () => {
  const { data } = useQuery({
    queryKey: ["user"],
    enabled: false,
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      queryClient.setQueryData(["user"], () => user);
    });
    return unsubscribe;
  }, [queryClient]);
  if (!data) return;

  return data;
};

export const useSubscription = () => {
  return [];
};

export const useBtcBlockHeight = () => {
  return useQuery({
    queryKey: ["btcBlockHeight"],
    queryFn: async () => {
      const response = await fetch("https://blockchain.info/q/getblockcount");
      if (response.ok) return await response.text();
    },
    refetchInterval: 5 * 60 * 1000,
  });
};

export const useEthBlockHeight = () => {
  return useQuery({
    queryKey: ["ethBlockHeight"],
    queryFn: async () => {
      const response = await fetch("/api/ethBlockNumber");
      console.log(response);
      if (!response.ok) return false;

      const json = await response.json();
      console.log(json);
      const height = json?.height;
      return height;
    },
    refetchInterval: 1 * 60 * 1000,
  });
};
