import { fromWei } from "web3-utils";
import { toBitcoin } from "satoshi-bitcoin";

/**
 *
 * @param {BigInt} sats
 * @returns string
 */
export const satsToBtc = (sats) => {
  return toBitcoin(sats.toString(10)).toString(10);
};

export const weiToEther = (wei = 0) => {
  return fromWei(wei, "ether").toString();
};
