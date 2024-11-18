import { db } from "../config/firebase.js";
import { COLLECTIONS } from "../config/firestoreConstants.js";

export const getActiveAddresses = async () => {
  const collref = db.collection(COLLECTIONS.BTC_ADDRESSES);
  const snapshot = await collref.where("user_counter", ">", 0).get();
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
