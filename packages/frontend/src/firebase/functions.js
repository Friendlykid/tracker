import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export const getEthBlockHeight = async () => {
  const fn = httpsCallable(functions, "getEthBlockHeight");
  const result = await fn();
  return result.data.blockHeight;
};
