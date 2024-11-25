import { BigNumber } from "alchemy-sdk";
import { alchemy } from "../config/alchemy.js";
import { getTokenInfo } from "../config/cache.js";
import { db } from "../config/firebase.js";
import { COLLECTIONS } from "../config/firestoreConstants.js";

export const addTokenBalances = async (addr) => {
  const { tokenBalances } = await alchemy.core.getTokenBalances(addr);
  const batch = db.batch();

  await Promise.all(
    tokenBalances.map(async ({ contractAddress, tokenBalance }) => {
      const { logoURI, symbol, decimals } = await getTokenInfo(contractAddress);

      batch.set(
        db
          .collection(COLLECTIONS.ETH_ADDRESSES)
          .doc(addr)
          .collection(COLLECTIONS.TOKENS)
          .doc(contractAddress),
        {
          amount: BigNumber.from(tokenBalance).div(decimals).toString(),
          logoURI: logoURI,
          symbol: symbol,
        }
      );
    })
  );
  await batch.commit();
};
