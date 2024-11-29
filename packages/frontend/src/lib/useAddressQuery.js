import { useRouter } from "next/router";
import { useBtcSubscriptions, useEthSubscriptions } from "./query";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { COLLECTIONS } from "@/firebase/constants";
import { db } from "@/firebase/firebase";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const useAddress = () => {
  const router = useRouter();
  const { data: btcSubs, isFetched: isBtcFetched } = useBtcSubscriptions();
  const { data: ethSubs, isFetched: isEthFetched } = useEthSubscriptions();
  const [address, setAddress] = useState(null);
  const [coll, setColl] = useState(null);
  const query = useQuery({
    queryKey: ["btc_wallet", address],
    queryFn: async () => {
      if (!address || !isBtcFetched || !isEthFetched || !coll) {
        return Error();
      }
      if (
        (!btcSubs.map((sub) => sub.addr).includes(address) &&
          coll === COLLECTIONS.BTC_ADDRESSES) ||
        (!ethSubs.map((sub) => sub.addr).includes(address) &&
          coll === COLLECTIONS.ETH_ADDRESSES)
      ) {
        router.push("/404");
        return Error();
      }
      const docRef = doc(db, coll, address);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists) {
        router.push("/404");
        return Error();
      }

      const rootData = docSnap.data();
      let txSnap;
      try {
        txSnap = await getDocs(collection(db, coll, address, "transactions"));
      } catch (e) {
        console.error(e);
        return {
          initValue: rootData.amount,
          address,
          name:
            coll === COLLECTIONS.BTC_ADDRESSES
              ? btcSubs.find((addr) => addr.addr === address).name
              : ethSubs.find((addr) => addr.addr === address).name,
        };
      }
      const txs = [];
      txSnap.forEach((doc) => {
        txs.push({ hash: doc.id, ...doc.data() });
      });

      return {
        initValue: rootData.amount,
        txs,
        address,
        name: (coll === COLLECTIONS.BTC_ADDRESSES
          ? btcSubs.find((addr) => addr.addr === address)
          : ethSubs.find((addr) => addr.addr === address)
        ).name,
      };
    },
    enabled: !!address && isBtcFetched && isEthFetched && !!coll,
    refetchInterval: 15_000,
  });
  useEffect(() => {
    if (!/(btc_wallet|eth_wallet)\//.test(router.asPath)) {
      setAddress(null);
      setColl(null);
    }
    setAddress(router.asPath.split("/").pop());
    setColl(
      router.asPath.split("/")[2] === "btc_wallet"
        ? COLLECTIONS.BTC_ADDRESSES
        : router.asPath.split("/")[2] === "eth_wallet"
        ? COLLECTIONS.ETH_ADDRESSES
        : null
    );
  }, [router.asPath, setAddress]);

  return query;
};
