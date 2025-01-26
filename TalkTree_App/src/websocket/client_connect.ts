import WebSocket from "@tauri-apps/plugin-websocket";
import { createSignal } from "solid-js";
import handle_response from "./client_handle_response";

export const [WS, SET_WS] = createSignal<WebSocket | null>(null);

export const client_connect = async (ip: string): Promise<boolean> => {
  try {
    const url = `ws://${ip}`;
    const socket = await WebSocket.connect(url);

    socket.addListener((msg) => {
      if (msg.data && typeof msg.data === "string") {
        handle_response(msg.data);
      }
    });

    SET_WS(socket);

    return true;
  } catch (error) {
    console.warn(error);
  }
  return false;
};

export default client_connect;
