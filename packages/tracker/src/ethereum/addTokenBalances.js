import { BigNumber } from "alchemy-sdk";
import { alchemy } from "../config/alchemy.js";
import { getTokenInfo } from "../config/cache.js";
import { db } from "../config/firebase.js";
import { COLLECTIONS } from "../config/firestoreConstants.js";
import { delay } from "../utils/delay.js";

export const getBalances = async (addr, counter = 0) => {
  if (counter > 5) return;
  try {
    const { tokenBalances } = await alchemy.core.getTokenBalances(addr);
    return tokenBalances;
  } catch (e) {
    console.log("alchemy server error");
    console.error(e);
    await delay(5000);
    return await getBalances(addr, counter + 1);
  }
};

export const addTokenBalances = async (addr) => {
  const tokenBalances = await getBalances(addr);
  const batch = db.batch();

  for await (const token of tokenBalances) {
    const { contractAddress, tokenBalance } = token;
    const tokenInfo = getTokenInfo(contractAddress);

    batch.set(
      db
        .collection(COLLECTIONS.ETH_ADDRESSES)
        .doc(addr)
        .collection(COLLECTIONS.TOKENS)
        .doc(contractAddress),
      {
        ...(tokenInfo
          ? {
              amount: BigNumber.from(tokenBalance)
                .div(tokenInfo.decimals)
                .toString(),
              logoURI: tokenInfo.logoURI,
              symbol: tokenInfo.symbol,
            }
          : { amount: BigNumber.from(tokenBalance).toString() }),
      }
    );
    await delay(1000);
  }
  await batch.commit();
};
