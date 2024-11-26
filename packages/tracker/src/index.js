import { updateBtcAddresses } from "./bitcoin/updateBtcAddresses.js";
import { btcNewBlocks } from "./bitcoin/websocket.js";
import { cacheTokens } from "./config/cache.js";
import { subscribeEthAddress } from "./ethereum/websocket.js";

(async () => {
  await cacheTokens();
  btcNewBlocks();
  updateBtcAddresses();
})();

//subscribeEthAddress("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48");

// just to keep the service going
setInterval(() => {}, 1 << 30);
