import { Timestamp } from "firebase-admin/firestore";
import { db } from "../config/firebase.js";
import { COLLECTIONS } from "../config/firestoreConstants.js";
import { sendEmails } from "../email/sendEmails.js";
import { satsToBtc } from "../utils/conversion.js";
import { getBtcBlock } from "./getBlockchainInfo.js";

export const getBtcAmount = (addr, tx) => {
  const inputAddresses = tx.inputs
    .map((input) => input?.prev_out?.addr)
    .filter(Boolean);
  if (inputAddresses.every((input) => !input || input !== addr)) {
    // address recieves BTC from someone or its a block reward
    return satsToBtc(
      tx.out
        .filter((out) => out.addr === addr)
        .map((out) => out.value)
        .reduce((acc, sats) => acc + BigInt(sats), 0n)
    );
  }
  const amount = satsToBtc(
    tx.inputs
      .filter((input) => input.prev_out.addr === addr)
      .map((input) => input.prev_out.value)
      .reduce((acc, sats) => {
        return BigInt(sats) + acc;
      }, 0n)
  );
  return `${amount !== "0" ? "-" : ""}${amount}`;
};

const convertToBtc = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [key, satsToBtc(value)])
  );

const filterTx = (tx) => {
  const inputs = tx.inputs.reduce((acc, input) => {
    const key = input.prev_out?.addr ?? "block_reward";
    acc[key] = (acc[key] ?? 0n) + BigInt(input.prev_out.value);
    return acc;
  }, {});

  const outs = tx.out.reduce((acc, out) => {
    const key = out?.addr ?? "unknown";
    acc[key] = (acc[key] ?? 0n) + BigInt(out.value);
    return acc;
  }, {});

  return {
    hash: tx.hash,
    block_height: tx.block_height,
    inputs: convertToBtc(inputs),
    outs: convertToBtc(outs),
  };
};

const addAddressesWithTransactions = async (addresses, transactions, time) => {
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
          console.log(
            "adding btc tx to",
            COLLECTIONS.BTC_TXS(address.addr, tx.hash)
          );
          const filteredTx = filterTx(tx);
          await db
            .doc(COLLECTIONS.BTC_TXS(address.addr, tx.hash))
            .set({ amount, time, ...filteredTx });
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
  const time = Timestamp.fromDate(new Date(block.time * 1000));
  await addAddressesWithTransactions(addresses, block.tx, time);
};
