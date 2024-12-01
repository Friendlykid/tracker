import { COLLECTIONS } from "@/firebase/constants";
import { auth, db } from "@/firebase/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useEffect } from "react";
import { BITCOIN } from "./constants";

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
      if (response.ok) return await response.text();
    },
    refetchInterval: 1 * 60 * 1000,
  });
};

export const useBtcSubscriptions = () => {
  const user = useUser();
  return useQuery({
    queryKey: ["btcSubscriptions"],
    queryFn: async () => {
      if (!user) throw new Error("User not loaded");
      const querySnapshot = await getDocs(
        collection(db, COLLECTIONS.BTC_SUBSCRIPTIONS(user.uid))
      );
      const subs = [];
      querySnapshot.forEach((doc) => {
        subs.push({ addr: doc.id, ...doc.data() });
      });
      return subs;
    },
    enabled: !!user,
  });
};

export const useEthSubscriptions = () => {
  const user = useUser();
  return useQuery({
    queryKey: ["ethSubscriptions"],
    queryFn: async () => {
      if (!user) throw new Error("User not loaded");
      const querySnapshot = await getDocs(
        collection(db, COLLECTIONS.ETH_SUBSCRIPTIONS(user.uid))
      );
      const subs = [];
      querySnapshot.forEach((doc) => {
        subs.push({ addr: doc.id, ...doc.data() });
      });
      return subs;
    },
    enabled: !!user,
  });
};

export const useSubscription = (blockchain, address) => {
  const user = useUser();
  const query = useQuery({
    queryKey: ["subscription", blockchain, address],
    queryFn: async () => {
      if (!blockchain || !address || !user) return false;
      const docRef = doc(
        db,
        blockchain === BITCOIN
          ? COLLECTIONS.BTC_SUBSCRIPTIONS(user.uid)
          : COLLECTIONS.ETH_SUBSCRIPTIONS(user.uid),
        address
      );
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) return false;
      return docSnap.data();
    },
    enabled: !!blockchain && !!address && !!user,
  });
  return query;
};
