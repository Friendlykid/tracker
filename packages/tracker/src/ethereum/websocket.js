import { AlchemySubscription, BigNumber } from "alchemy-sdk";
import { alchemy } from "../config/alchemy.js";
import { keccak256 } from "web3-utils";
import { decodeAddress, encodeAddress } from "../utils/decode.js";
import { getTokenInfo } from "../config/cache.js";
import { db } from "../config/firebase.js";
import { COLLECTIONS } from "../config/firestoreConstants.js";
import { weiToEther } from "../utils/conversion.js";
import { mailToUsers } from "../email/sendEmails.js";

const TRANSFER_EVENT = keccak256("Transfer(address,address,uint256)");

const sendERC20Transaction =
  (addr, operator = "") =>
  async (tx) => {
    await mailToUsers(addr, COLLECTIONS.ETH_ADDRESSES, "emails_erc_20");

    const senderAddr = decodeAddress(tx.topics[1]);
    const amount = BigNumber.from(tx.data);
    const tokenAddress = tx.address;
    const tokenInfo = await getTokenInfo(tokenAddress);
    const tokenAmount = tokenInfo
      ? amount.div(tokenInfo.decimals).toString()
      : amount;
    db.doc(
      COLLECTIONS.ETH_TXS(addr, `${tx.transactionHash}-${Number(tx.logIndex)}`)
    ).set({
      amount: `${operator}${tokenAmount.toString()}`,
      from: senderAddr,
      to: addr,
      blockNumber: tx.blockNumber,
      blockHash: tx.blockHash,
      contractAddress: tx.address,
      ...(tokenInfo
        ? {
            tokenName: tokenInfo.name,
            logoURI: tokenInfo.logoURI,
            symbol: tokenInfo.symbol,
          }
        : {}),
    });
  };

// only for watching ether transactions
export const subscribeEthAddress = (addr) => {
  if (!addr) return;
  alchemy.ws.on(
    {
      method: AlchemySubscription.MINED_TRANSACTIONS,
      addresses: [
        {
          from: addr,
        },
        {
          to: addr,
        },
      ],
      includeRemoved: true,
      hashesOnly: false,
    },
    async (tx) => {
      if (tx.removed) {
        // transaction got removed, chain has been reorganized
        db.doc(COLLECTIONS.ETH_TXS(addr, tx.transaction.hash)).delete();
        return;
      }
      if (tx.transaction.value === "0x0") {
        // transaction is not transfering ether, can be skipped
        return;
      }
      await mailToUsers(addr, COLLECTIONS.ETH_ADDRESSES, "emails");

      await db.doc(COLLECTIONS.ETH_TXS(addr, tx.transactionHash)).set({
        amount: `${tx.transaction.to !== addr ? "-" : ""}${weiToEther(
          tx.transaction.value
        )}`,
        from: tx.transaction.from,
        to: tx.transaction.to,
        blockNumber: tx.transaction.blockNumber,
        blockHash: tx.transaction.blockHash,
        logoURI:
          "https://seeklogo.com/images/E/ethereum-eth-logo-CF9DCCA696-seeklogo.com.png",
        symbol: "ETH",
      });
    }
  );
};

export const subscribeEthERC20Address = (addr = []) => {
  //adress sends token
  alchemy.ws.on(
    {
      topics: [TRANSFER_EVENT, encodeAddress(addr), null],
      hashesOnly: false,
    },
    sendERC20Transaction(addr, "-")
  );

  //address recieves token
  alchemy.ws.on(
    {
      topics: [TRANSFER_EVENT, null, encodeAddress(addr)],
      hashesOnly: false,
    },
    sendERC20Transaction(addr)
  );
};

export const unsubscribeEthAddress = (addr) => {
  alchemy.ws.on({
    method: AlchemySubscription.MINED_TRANSACTIONS,
    addresses: [
      {
        from: addr,
      },
      {
        to: addr,
      },
    ],
    includeRemoved: true,
    hashesOnly: false,
  });
};

export const unsubscribeEthErc20Address = (addr) => {
  alchemy.ws.off({
    topics: [TRANSFER_EVENT, encodeAddress(addr), null],
    hashesOnly: false,
  });
  alchemy.ws.off({
    topics: [TRANSFER_EVENT, null, encodeAddress(addr)],
    hashesOnly: false,
  });
};
