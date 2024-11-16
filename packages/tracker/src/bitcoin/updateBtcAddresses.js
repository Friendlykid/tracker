import { getBtcBlockHeight } from "../config/cache.js";
import { db } from "../config/firebase.js";
import { getAddressBalance } from "./getBlockchainInfo.js";
import { subscribeBtcAddress, unsubscribeBtcAddress } from "./websocket.js";

export const updateBtcAddresses = async () => {
  const addrRef = db.collection("btc_addresses");
  addrRef.onSnapshot((snapshot) => {
    snapshot.docChanges().forEach(async (change) => {
      if (change.type === "added") {
        console.log("New document added:", change.doc.id, change.doc.data());
        try {
          const blockHeight = await getBtcBlockHeight();
          const amount = await getAddressBalance(change.doc.id);
          // set initial info
          await addrRef
            .doc(change.doc.id)
            .update({ initial_block_height: blockHeight, amount });
          // listen for new transactions
          subscribeBtcAddress(change.doc.id);
        } catch (error) {
          console.error(`Error updating document ${change.doc.id}:`, error);
        }
      }
      if (change.type === "modified") {
        const data = change.doc.data();

        // Check if counter is equal to zero
        if (data.counter === 0) {
          console.log(`Document ${change.doc.id} has counter set to zero.`);
          unsubscribeBtcAddress(change.doc.id);
        }
      }
    });
  });
};
