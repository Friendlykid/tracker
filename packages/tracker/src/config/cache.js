import NodeCache from "node-cache";
import { getLastBtcBlockHeight } from "../bitcoin/getBlockchainInfo.js";

const cache = new NodeCache({ stdTTL: 0 });
const btcTxCache = new NodeCache();

export const cacheTokens = async () => {
  const response = await fetch(
    "https://wispy-bird-88a7.uniswap.workers.dev/?url=http://tokens.1inch.eth.link"
  );
  if (response.ok) {
    const tokenList = await response.json();
    tokenList.tokens.forEach((token) => {
      const { chainId, address, ...other } = token;
      cache.set(address, { ...other });
    });
  }
};

export const getTokenInfo = (addr) => {
  return cache.get(addr);
};

export const getBtcBlockHeight = async () => {
  if (!cache.get("btcHeight")) {
    const height = await getLastBtcBlockHeight();
    cache.set("btcHeight", height, 9 * 60);
    return height;
  }
  return cache.get("btcHeight");
};

export const updateBtcBlockHeight = (newHeight) => {
  cache.set("btcHeight", newHeight, 9 * 60);
};

export const addUncomfirmedBtcTransaction = (addr, hash) => {
  btcTxCache.set(hash, addr);
};

export const getUncofirmedBtcTxHashes = () => {
  return btcTxCache.keys();
};

export const removeBtcTxsFromCache = (hashes) => {
  return hashes.map((hash) => btcTxCache.take(hash));
};
