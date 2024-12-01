import { subDays } from "date-fns";
import { Timestamp } from "firebase/firestore";

/**
 *
 * @param {Timestamp|undefined} timestamp
 * @returns {Date}
 */
export const timestampToDate = (timestamp) => {
  return !timestamp
    ? timestampToDate(getRandomFirestoreTimestamp())
    : new Date(timestamp.seconds * 1_000 + timestamp.nanoseconds / 1_000_000);
};
// just for old values,
export const getRandomFirestoreTimestamp = () => {
  return new Timestamp(
    subDays(new Date(), 7).getSeconds(),
    subDays(new Date(), 7).getMilliseconds() / 1000
  );
};
