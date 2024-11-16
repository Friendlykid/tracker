import { updateBtcBlockHeight } from "../config/cache.js";
import { onNewBlock } from "./onNewBlock.js";
import { wsTemplate } from "./wsTemplate.js";

/**
 * listens to new bitcoin blocks
 */
export const btcNewBlocks = () => {
  wsTemplate({
    open: { op: "blocks_sub" },
    message: (block) => {
      console.log("newBlock:", block);
      const newHeight = block.x.height;
      const hash = block.x.hash;
      updateBtcBlockHeight(newHeight);
      onNewBlock(hash);
    },
    error: btcNewBlocks,
    close: btcNewBlocks,
  });
};

export const unconfirmed = () => {
  wsTemplate({
    open: { op: "unconfirmed_sub" },
    message: (tx) => {
      console.log("newTx:", tx);
    },
    error: unconfirmed,
    close: unconfirmed,
  });
};

export const subscribeBtcAddress = (addr) => {
  wsTemplate({
    open: {
      op: "addr_sub",
      addr,
    },
    message: (block) => {
      console.log("Received message:", block);
    },
    error: (error) => {
      console.error("WebSocket error:", error);
    },
    close: () => {
      console.log("Restarting connection for address:", addr);
      subscribeBtcAddress(addr); // Reconnect on close
    },
  });
};

export const unsubscribeBtcAddress = (addr) => {
  wsTemplate({
    open: {
      op: "addr_unsub",
      addr,
    },
  });
};
