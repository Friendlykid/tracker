import { Timestamp } from "firebase/firestore";

export const timestampToDate = (timestamp) => {
  if (!timestamp) return;
  return new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
};
