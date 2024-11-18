import { BigNumber } from "alchemy-sdk";

export const decodeAddress = (hex) => {
  return hex.replace("000000000000000000000000", "");
};

export const encodeAddress = (hex) => {
  return `0x000000000000000000000000${hex.replace(/^0x/, "")}`;
};

/**
 *
 * @param { bigint|boolean|number|string} hex
 * @returns {BigNumber}
 */
export const decodeAmount = (hex) => {
  return BigNumber.from(hex);
};
