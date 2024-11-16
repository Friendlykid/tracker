import {
  getUncofirmedBtcTxHashes,
  removeBtcTxsFromCache,
} from "../config/cache.js";
import { db } from "../config/firebase.js";
import { COLLECTIONS } from "../config/firestoreConstants.js";
import { satsToBtc } from "../utils/conversion.js";
import { getBtcBlock } from "./getBlockchainInfo.js";

const getBtcAmount = (addr, tx) => {
  const inputAddresses = tx.inputs.map((input) => input?.addr);
  if (inputAddresses.every((input) => !input || input !== addr)) {
    // address recieves BTC from someone or its a block reward
    return satsToBtc(
      tx.outs
        .filter((out) => out.addr === addr)
        .map((out) => out.value)
        .reduce((acc, sats) => acc + sats, 0)
    );
  }
  return (
    satsToBtc(
      tx.inputs
        .filter((input) => input.addr === addr)
        .map((input) => input.value)
        .reduce((acc, sats) => sats + acc, 0)
    ) * -1
  );
};

const filterTx = (tx) => {
  const inputs = tx.inputs.reduce((acc, input) => {
    acc[input?.addr ?? "block_reward"] = satsToBtc(input.value);
    return acc;
  }, {});

  const outs = tx.out.reduce((acc, out) => {
    acc[out?.addr ?? "block_reward"] = satsToBtc(out.value);
    return acc;
  }, {});

  return {
    hash: tx.hash,
    block_height: tx.block_height,
    inputs,
    outs,
  };
};

export const onNewBlock = async (hash) => {
  const txHashes = getUncofirmedBtcTxHashes();
  if (!txHashes || txHashes.length === 0) return;
  const block = await getBtcBlock(hash);
  const txsToAdd = block.tx.filter((tx) => txHashes.includes(tx.hash));
  if (txsToAdd.length === 0) return;

  const addresses = removeBtcTxsFromCache(txsToAdd.map((tx) => tx.hash));
  Promise.all(
    addresses.map(async (addr, i) => {
      const amount = getBtcAmount(addr, txsToAdd[i]);
      await db
        .collection(COLLECTIONS.BTC_ADDRESSES)
        .doc(txsToAdd[i].hash)
        .set({ amount, ...filterTx(txsToAdd[i]) });
    })
  );
};
