import { db } from "../config/firebase.js";

export const getActiveAddresses = async () => {
  const addrRef = db.collection("btc_addresses");
  const snapshot = await addrRef.where("user_counter", ">", 0).get();
  if (snapshot.empty) {
    console.log("no addresses to track");
    return [];
  }
  const activeAddr = [];
  snapshot.forEach((doc) => {
    activeAddr.push({ addr: doc.id, ...doc.data() });
  });
  return activeAddr;
};
