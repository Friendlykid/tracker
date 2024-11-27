import "./env.js";
import { btcNewBlocks } from "./bitcoin/websocket.js";
import { cacheTokens } from "./config/cache.js";
import { updateEthAddresses } from "./ethereum/updateEthAddresses.js";

(async () => {
  await cacheTokens();
  btcNewBlocks();
  updateEthAddresses();
})();

// just to keep the service going
setInterval(() => {}, 1 << 30);
