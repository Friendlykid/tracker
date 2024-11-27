import { alchemy } from "../config/alchemy.js";

/**
 *
 * @param {string} addr
 * @returns {Promise<String>}
 */
export const getEthAddressBalance = async (addr) => {
  return (await alchemy.core.getBalance(addr, "latest")).toString();
};
