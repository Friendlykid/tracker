import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export const getEthBlockHeight = async () => {
  const fn = httpsCallable(functions, "getEthBlockHeight", {
    limitedUseAppCheckTokens: true,
  });
  const result = await fn();
  return result.data.blockHeight;
};

export const getRandomChartData = async () => {
  const fn = httpsCallable(functions, "getRandomBtChartData", {
    limitedUseAppCheckTokens: true,
  });
  const result = await fn();
  if (result.data.success) return result.data.data;
  throw new Error("something went wrong");
};
