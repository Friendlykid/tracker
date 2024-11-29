import { useRouter } from "next/router";
import { useBtcSubscriptions, useEthSubscriptions } from "./query";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { COLLECTIONS } from "@/firebase/constants";
import { db } from "@/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

const ERROR_DATA_LOADING = "data not loaded";
const ERROR_NOT_EXISTS = "not exists";

export const useAddress = () => {
  const router = useRouter();
  const { data: btcSubs, isFetched: isBtcFetched } = useBtcSubscriptions();
  const { data: ethSubs, isFetched: isEthFetched } = useEthSubscriptions();
  const address = useMemo(
    () => router.asPath.split("/").pop(),
    [router.asPath]
  );
  const coll = useMemo(() => {
    const pathSegment = router.asPath.split("/")[2];
    return pathSegment === "btc_wallet"
      ? COLLECTIONS.BTC_ADDRESSES
      : pathSegment === "eth_wallet"
      ? COLLECTIONS.ETH_ADDRESSES
      : null;
  }, [router.asPath]);
  const query = useQuery({
    queryKey: ["wallet", address],
    queryFn: async () => {
      if (!address || !isBtcFetched || !isEthFetched || !coll) {
        throw new Error(ERROR_DATA_LOADING);
      }
      if (
        (!btcSubs.map((sub) => sub.addr).includes(address) &&
          coll === COLLECTIONS.BTC_ADDRESSES) ||
        (!ethSubs.map((sub) => sub.addr).includes(address) &&
          coll === COLLECTIONS.ETH_ADDRESSES)
      ) {
        throw new Error(ERROR_NOT_EXISTS);
      }
      const docRef = doc(db, coll, address);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists) {
        throw new Error(ERROR_NOT_EXISTS);
      }
      const rootData = docSnap.data();

      const baseData = {
        initValue: rootData.amount,
        address,
        name: (coll === COLLECTIONS.BTC_ADDRESSES
          ? btcSubs.find((addr) => addr.addr === address)
          : ethSubs.find((addr) => addr.addr === address)
        ).name,
      };

      let txSnap;
      try {
        txSnap = await getDocs(collection(db, coll, address, "transactions"));
      } catch (e) {
        return {
          ...baseData,
          txs: [],
        };
      }
      const txs = [];
      txSnap.forEach((doc) => {
        txs.push({ hash: doc.id, ...doc.data() });
      });
      return {
        txs,
        ...baseData,
      };
    },
    enabled: !!address && isBtcFetched && isEthFetched && !!coll,
    refetchInterval: 15_000,
    retry: (failureCount, error) => {
      if (error.message.includes(ERROR_NOT_EXISTS)) {
        if (failureCount > 5) router.push("/404");
        return failureCount < 5;
      }
      return error.message.includes(ERROR_DATA_LOADING) || failureCount < 5;
    },
    retryDelay: (retryAtempt, error) => {
      if (error.message.includes(ERROR_NOT_EXISTS)) {
        return retryAtempt * 2000;
      }
      return retryAtempt * 1000;
    },
  });
  return query;
};
