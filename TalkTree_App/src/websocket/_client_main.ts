import { websocket_request } from "./client_request";

export const client_main = async () => {
  await websocket_request("info", "total");
  await websocket_request("info", "buttons");
  await websocket_request("info", "audio");
};

