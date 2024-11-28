import { COLLECTIONS } from "@/firebase/constants";
import { auth, db } from "@/firebase/firebase";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { BITCOIN } from "./constants";
import { useRouter } from "next/router";

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
      if (!user) return new Error("User not loaded");
      const querySnapshot = await getDocs(
        collection(db, COLLECTIONS.BTC_SUBSCRIPTIONS(user.uid))
      );
      const subs = [];
      querySnapshot.forEach((doc) => {
        subs.push({ addr: doc.id, ...doc.data() });
      });
      return subs;
    },
  });
};

export const useEthSubscriptions = () => {
  const user = useUser();
  return useQuery({
    queryKey: ["ethSubscriptions"],
    queryFn: async () => {
      if (!user) return new Error("User not loaded");
      const querySnapshot = await getDocs(
        collection(db, COLLECTIONS.ETH_SUBSCRIPTIONS(user.uid))
      );
      const subs = [];
      querySnapshot.forEach((doc) => {
        subs.push({ addr: doc.id, ...doc.data() });
      });
      return subs;
    },
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
      if (!docSnap.exists) return false;
      return docSnap.data();
    },
    enabled: !!blockchain && !!address && !!user,
  });
  return query;
};

export const useAddress = () => {
  const router = useRouter();
  const { data: btcSubs, isFetched: isBtcFetched } = useBtcSubscriptions();
  const { data: ethSubs, isFetched: isEthFetched } = useEthSubscriptions();
  const [address, setAddress] = useState(null);
  const [collection, setCollection] = useState(null);
  const query = useQuery({
    queryKey: ["btc_wallet", address],
    queryFn: async () => {
      if (!address || !isBtcFetched || !isEthFetched || !collection)
        return Error();
      if (
        (!btcSubs.map((sub) => sub.addr).includes(address) &&
          collection === COLLECTIONS.BTC_ADDRESSES) ||
        (!ethSubs.map((sub) => sub.addr).includes(address) &&
          collection === COLLECTIONS.ETH_ADDRESSES)
      ) {
        router.push("/404");
        return Error();
      }
      const docRef = doc(db, collection, address);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists) {
        router.push("/404");
        return Error();
      }
      const rootData = docSnap.data();
      let txSnap;
      try {
        txSnap = await getDocs(
          collection(db, collection, address, "transactions")
        );
      } catch (e) {
        return {
          initValue: rootData.amount,
          address,
          name:
            collection === COLLECTIONS.BTC_ADDRESSES
              ? btcSubs.find((addr) => addr.addr === address).name
              : ethSubs.find((addr) => addr.addr === address).name,
        };
      }

      const txs = txSnap.docs();
      return {
        initValue: rootData.amount,
        txs,
        address,
        name:
          collection === COLLECTIONS.BTC_ADDRESSES
            ? btcSubs.find((addr) => addr.addr === address)
            : ethSubs.find((addr) => addr.addr === address),
      };
    },
    enabled: !!address && isBtcFetched && isEthFetched && !!collection,
  });
  useEffect(() => {
    if (!/(btc_wallet|eth_wallet)\//.test(router.asPath)) {
      setAddress(null);
      setCollection(null);
    }
    setAddress(router.asPath.split("/").pop());
    setCollection(
      router.asPath.split("/")[2] === "btc_wallet"
        ? COLLECTIONS.BTC_ADDRESSES
        : router.asPath.split("/")[2] === "eth_wallet"
        ? COLLECTIONS.ETH_ADDRESSES
        : null
    );
  }, [router, setAddress]);

  return query;
};
