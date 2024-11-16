import { WebSocket } from "ws";

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
    console.log("opening connection");
  });

  ws.on("message", (data) => message(JSON.parse(data.toString())));

  ws.on("error", error);

  ws.on("close", (e) => {
    close(e);
    console.log("closing connection");
  });
};
