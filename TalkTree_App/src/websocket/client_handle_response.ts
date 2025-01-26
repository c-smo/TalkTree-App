import {
  globals_init_settings,
  SET_SHOW_WELCOME,
  SET_UPDATES,
  UPDATES,
} from "../globals";
import { err } from "../terminal/commands/logs";
import { SqlWrapper } from "../types";
import { set_border_highlight } from "../ui/border_highlight";
import { client_main } from "./_client_main";
import { websocket_request } from "./client_request";
import client_push_update from "./client_update";

const handle_response = (server_response: string) => {
  const map = {
    sql_info: handle_info,
    sql_update: handle_update,
    greet: handle_greeting,
  };

  const argv = server_response.split("|");
  const head = argv[0].toLowerCase() as keyof typeof map;
  const body = argv.slice(1).join("");

  if (Object.keys(map).includes(head)) {
    void map[head](body);
  }
};

const handle_greeting = async (encoded_settings: string): Promise<void> => {
  await globals_init_settings(encoded_settings);
  SET_SHOW_WELCOME(false);
  void client_main();
};

const handle_info = async (info: string) => {
  const allKeys = info.split(",") as string[];
  const table_name = allKeys.shift() as string;

  SET_UPDATES(UPDATES() + allKeys.length);
  await set_border_highlight({ visible: true });

  for (let key of allKeys) {
    await websocket_request("update", `${key}@${table_name}`).catch((e) =>
      err(e),
    );
  }
};

const handle_update = async (update: string) => {
  const data = update.split(",");
  const wrapper: SqlWrapper = {
    table_name: `${data.shift()}`,
    key: `${data.shift()}`,
    value: new Uint8Array(data.map(Number)),
  };
  void client_push_update(wrapper);
};

export default handle_response;
