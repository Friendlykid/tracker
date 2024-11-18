import { updateBtcAddresses } from "./bitcoin/updateBtcAddresses.js";
import { btcNewBlocks } from "./bitcoin/websocket.js";
import { cacheTokens } from "./config/cache.js";

(async () => {
  // await cacheTokens();
  btcNewBlocks();
  updateBtcAddresses();
})();

// just to keep the service going
setInterval(() => {}, 1 << 30);
