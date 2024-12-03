import NodeCache from "node-cache";
import { getLastBtcBlockHeight } from "../bitcoin/getBlockchainInfo.js";
import { readFile } from "fs/promises";
import path from "path";

const cache = new NodeCache({ stdTTL: 0 });

export const cacheTokens = async () => {
  const oneInchList = JSON.parse(
    await readFile(path.join(process.cwd(), "lists/tokenList1Inch.json"))
  );
  const coingeckoList = JSON.parse(
    await readFile(path.join(process.cwd(), "lists/tokenListCoingecko.json"))
  );
  oneInchList.tokens.forEach((token) => {
    // eslint-disable-next-line no-unused-vars
    const { chainId, address, ...other } = token;
    cache.set(address, { ...other });
  });
  coingeckoList.tokens.forEach((token) => {
    // eslint-disable-next-line no-unused-vars
    const { chainId, address, ...other } = token;
    if (cache.has(address)) return;
    cache.set(address, { ...other });
  });
};

export const getTokenInfo = (addr) => {
  if (!cache.has(addr)) return false;
  if (cache.has(addr)) {
    return cache.get(addr);
  }
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
