import { satsToBtc } from "../utils/conversion.js";

export const getAddressBalance = async (addr) => {
  const response = await fetch(
    `https://blockchain.info/balance?active=${addr}`
  );
  if (response.ok) {
    const data = await response.json();
    return satsToBtc(data[addr].final_balance);
  } else {
    return getAddressBalance(addr);
  }
};

export const getLastBtcBlockHeight = async () => {
  const response = await fetch(`https://blockchain.info/latestblock`);
  if (response.ok) {
    const data = await response.json();
    return data.height;
  } else {
    return getLastBtcBlockHeight();
  }
};

export const getBtcBlock = async (hash, counter = 0) => {
  if (counter > 10) return new Error("can't get BtcBlock");
  const response = await fetch(`https://blockchain.info/rawblock/${hash}`);
  if (!response.ok) {
    return await getBtcBlock(hash, counter + 1);
  }
  return await response.json();
};
