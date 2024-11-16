import { fromWei } from "web3-utils";
import { toBitcoin } from "satoshi-bitcoin";

export const satsToBtc = (sats) => {
  return toBitcoin(sats);
};

export const weiToEther = (wei) => {
  return fromWei(wei, "ether");
};
