import { db } from "../config/firebase.js";
import { COLLECTIONS } from "../config/firestoreConstants.js";
import { addTokenBalances } from "./addTokenBalances.js";
import {
  subscribeEthAddress,
  subscribeEthERC20Address,
  unsubscribeEthAddress,
  unsubscribeEthErc20Address,
} from "./websocket.js";

export const updateEthAddresses = async () => {
  const addrRef = db.collection(COLLECTIONS.ETH_ADDRESSES);
  addrRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        console.log("New eth address added:", change.doc.id);
        try {
          const blockNumber = await alchemy.core.getBlockNumber();
          const amount = await getEthAddressBalance(change.doc.id);

          // set initial info
          await addrRef
            .doc(change.doc.id)
            .update({ initial_block_number: blockNumber, amount });
          // listen for new transactions
          subscribeEthAddress(change.doc.id);
          if (change.doc.data().erc_20_counter !== 0) {
            await addTokenBalances(change.doc.id);
            subscribeEthERC20Address(change.doc.id);
          }
        } catch (error) {
          console.error(`Error updating document ${change.doc.id}:`, error);
        }
      }
      if (change.type === "modified") {
        const data = change.doc.data();

        // Check if counter is equal to zero
        if (data.counter === 0) {
          console.log(`Document ${change.doc.id} has counter set to zero.`);
          unsubscribeEthAddress(change.doc.id);
        }

        if (data.erc_20_counter === 0) {
          console.log(
            `Document ${change.doc.id} has ERC-20 counter set to zero.`
          );
          unsubscribeEthErc20Address(change.doc.id);
        }
      }
    });
  });
};
