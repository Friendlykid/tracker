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
      const tokenInfo =
        getTokenInfo(tokenAddress) ??
        (await alchemy.core.getTokenMetadata(addr));

      batch.set(
        db
          .collection(COLLECTIONS.ETH_ADDRESSES)
          .doc(addr)
          .collection(COLLECTIONS.TOKENS)
          .doc(contractAddress),
        {
          amount: BigNumber.from(tokenBalance)
            .div(tokenInfo.decimals)
            .toString(),
          logoURI: tokenInfo.logoURI ?? tokenInfo.logo,
          symbol: tokenInfo.symbol,
        }
      );
    })
  );
  await batch.commit();
};
