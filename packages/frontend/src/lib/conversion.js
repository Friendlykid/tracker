import { Timestamp } from "firebase/firestore";

export const timestampToDate = (timestamp) => {
  return !timestamp
    ? timestampToDate(getRandomFirestoreTimestamp())
    : new Timestamp(timestamp.seconds, timestamp.nanoseconds).toDate();
};

export const getRandomFirestoreTimestamp = () => {
  const now = Math.floor(Date.now() / 1000);
  const tenYearsInSeconds = 10 * 365 * 24 * 60 * 60;
  const randomSeconds = now - Math.floor(Math.random() * tenYearsInSeconds);

  const randomNanoseconds = Math.floor(Math.random() * 1e9);

  return new Timestamp(randomSeconds, randomNanoseconds);
};
