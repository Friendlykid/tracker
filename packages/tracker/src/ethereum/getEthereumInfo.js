import { alchemy } from "../config/alchemy.js";
import { weiToEther } from "../utils/conversion.js";

/**
 *
 * @param {string} addr
 * @returns {Promise<String>}
 */
export const getEthAddressBalance = async (addr) => {
  return weiToEther(await alchemy.core.getBalance(addr, "latest"));
};
