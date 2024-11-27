import { db } from "../config/firebase.js";
import { COLLECTIONS } from "../config/firestoreConstants.js";
import { sendEmails } from "../email/sendEmails.js";
import { satsToBtc } from "../utils/conversion.js";
import { getBtcBlock } from "./getBlockchainInfo.js";

const getBtcAmount = (addr, tx) => {
  const inputAddresses = tx.inputs.map((input) => input?.addr);
  if (inputAddresses.every((input) => !input || input !== addr)) {
    // address recieves BTC from someone or its a block reward
    return satsToBtc(
      tx.out
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

const addAddressesWithTransactions = async (addresses, transactions) => {
  return Promise.all(
    addresses.map(async (address) => {
      const matchingTransactions = transactions.filter(
        (transaction) =>
          transaction.inputs.some((input) => input.addr === address.addr) ||
          transaction.out.some((output) => output.addr === address.addr)
      );
      if (matchingTransactions.length === 0) return;
      await Promise.all(
        matchingTransactions.map(async (tx) => {
          if (address.emails && address.emails.length > 0) {
            sendEmails(address.emails);
          }
          const amount = getBtcAmount(address.addr, tx);
          await db
            .collection(COLLECTIONS.BTC_ADDRESSES)
            .doc(tx.hash)
            .set({ amount, ...filterTx(tx) });
        })
      );
    })
  );
};

export const onNewBlock = async (hash) => {
  const btcAddrRef = db.collection(COLLECTIONS.BTC_ADDRESSES);
  const snapshot = await btcAddrRef.get();
  const addresses = [];
  snapshot.forEach((doc) => {
    addresses.push({ addr: doc.id, ...doc.data() });
  });

  const block = await getBtcBlock(hash);
  await addAddressesWithTransactions(addresses, block.tx);
};
