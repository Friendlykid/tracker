import { AlchemySubscription, BigNumber } from "alchemy-sdk";
import { alchemy } from "../config/alchemy.js";
import { keccak256 } from "web3-utils";
import { decodeAddress, encodeAddress } from "../utils/decode.js";
import { getTokenInfo } from "../config/cache.js";
import { db } from "../config/firebase.js";
import { COLLECTIONS } from "../config/firestoreConstants.js";
import { weiToEther } from "../utils/conversion.js";
import { mailToUsers } from "../email/sendEmails.js";
import { Timestamp } from "firebase-admin/firestore";
import { formatUnits } from "ethers/utils";

const TRANSFER_EVENT = keccak256("Transfer(address,address,uint256)");

function isValidHexadecimal(str) {
  const hexRegex = /^0x[0-9a-fA-F]+$|^[0-9a-fA-F]+$/;
  return hexRegex.test(str);
}

const sendERC20Transaction =
  (addr, operator = "") =>
  async (tx) => {
    await mailToUsers(addr, COLLECTIONS.ETH_ADDRESSES, "emails_erc_20");

    const senderAddr = decodeAddress(tx.topics[1]);
    const hexAmount = isValidHexadecimal(tx.data) ? tx.data : "0x0";
    const amount = BigNumber.from(hexAmount);
    const tokenAddress = tx.address;
    const tokenInfo = await getTokenInfo(tokenAddress);
    const tokenAmount = tokenInfo
      ? formatUnits(amount, tokenInfo.decimals)
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
      time: Timestamp.fromDate(new Date()),
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
  console.log(`subscribeERC20 for ${addr}`);
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
      await db.doc(COLLECTIONS.ETH_TXS(addr, tx.transaction.hash)).set({
        amount: `${
          tx.transaction.to.toLowerCase() !== addr.toLowerCase() ? "-" : ""
        }${weiToEther(tx.transaction.value)}`,
        from: tx.transaction.from,
        to: tx.transaction.to,
        blockNumber:
          typeof tx.transaction.blockNumber === "number"
            ? tx.transaction.blockNumber.toString()
            : parseInt(tx.transaction.blockNumber, 16),
        blockHash: tx.transaction.blockHash,
        time: Timestamp.fromDate(new Date()),
        logoURI:
          "https://seeklogo.com/images/E/ethereum-eth-logo-CF9DCCA696-seeklogo.com.png",
        symbol: "ETH",
      });
      await mailToUsers(addr, COLLECTIONS.ETH_ADDRESSES, "emails");
    }
  );
};

export const subscribeEthERC20Address = (addr = []) => {
  console.log(`subscribeERC20 for ${addr}`);
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
  console.log(`unsubscribe Eth for ${addr}`);
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
  console.log(`unsubscribe Eth ERC20 for ${addr}`);
  alchemy.ws.off({
    topics: [TRANSFER_EVENT, encodeAddress(addr), null],
    hashesOnly: false,
  });
  alchemy.ws.off({
    topics: [TRANSFER_EVENT, null, encodeAddress(addr)],
    hashesOnly: false,
  });
};
