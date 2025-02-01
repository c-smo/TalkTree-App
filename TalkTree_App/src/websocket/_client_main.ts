import { validate_db_tables } from "../globals";
import { websocket_request } from "./client_request";

export const client_main = async () => {
  await validate_db_tables(true);
  await websocket_request("info", "total");
};
