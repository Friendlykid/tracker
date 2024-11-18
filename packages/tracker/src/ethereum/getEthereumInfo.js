import { alchemy } from "../config/alchemy.js";

/**
 *
 * @param {string} addr
 * @returns {Promise<BigInt>}
 */
export const getEthAddressBalance = async (addr) => {
  return await alchemy.core.getBalance(addr, "latest");
};
