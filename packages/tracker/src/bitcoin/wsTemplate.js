import { WebSocket } from "ws";
import { delay } from "../utils/delay.js";

const WEBSOCKET_URL = "wss://ws.blockchain.info/inv";

/**
 * @param {object} open - JSON object to open connection
 * @param {Function} error - function when websocket errors
 * @param {Function} message - function for proccesing incoming data
 * @param {Function} close - function when connection closes
 */
export const wsTemplate = ({
  open = { op: "ping" },
  error = (e) => {
    console.log(e);
  },
  message = (data) => console.log(data),
  close = (e) => {
    console.log(e);
  },
}) => {
  const ws = new WebSocket(WEBSOCKET_URL);

  ws.on("open", () => {
    ws.send(JSON.stringify(open));
  });

  ws.on("message", (data) => message(JSON.parse(data.toString())));

  ws.on("error", async (e) => {
    console.error("error: ", e);
    await delay(e.includes("Unexpected server response") ? 60 * 1000 : 1000);
    error();
  });

  ws.on("close", async (e) => {
    console.log("closing:", e);
    await delay(1000);
    close(e);
  });
};
