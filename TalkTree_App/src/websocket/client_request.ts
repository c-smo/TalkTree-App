import { WS } from "./client_connect";

export const websocket_request = async (
  tag: string,
  content?: string,
): Promise<void> => {
  const socket = WS();
  if (socket === null) {
    console.error(socket);
    return;
  }
  await socket.send(`request_${tag}|${content}`);
};
