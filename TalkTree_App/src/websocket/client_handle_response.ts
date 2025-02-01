import {
  globals_init_settings,
  SET_SHOW_WELCOME,
  SET_UPDATE_AMOUNT,
  UPDATE_AMOUNT,
} from "../globals";
import { SqlWrapper } from "../types";
import { set_border_highlight } from "../ui/border_highlight";
import { client_main } from "./_client_main";
import { websocket_request } from "./client_request";
import client_push_update from "./client_update";

const handle_response = (server_response: string) => {
  const map = {
    sql_update: handle_update,
    sql_total: handle_total,
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

const handle_total = async (all_info_string: string) => {
  const all_info = all_info_string.split(",")
  const total_amount = all_info.length
  SET_UPDATE_AMOUNT(total_amount);
  set_border_highlight({visible:true})

  for(let info of all_info){
    const table = info.split("-")[0] === "a" ? "audio" : "buttons"
    const key = info.split("-")[1]
    await websocket_request("update",`${key}@${table}`)

  }
  console.info("Total Updates", UPDATE_AMOUNT(), all_info)

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
