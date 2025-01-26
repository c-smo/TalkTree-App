import _frontend_init_ from "../_frontend_/_fontend_init_.ts";
import frontend_update from "../_frontend_/frontend_update.ts";
import {
  INPUT_VALUE,
  SET_INPUT_VALUE,
  SET_SHOW_WELCOME,
  validate_db_tables,
} from "../globals.ts";
import sql_get_key from "../sql/sql_get_key.ts";
import sql_read_uint8array from "../sql/sql_read_unit8array.ts";
import { err } from "../terminal/commands/logs.ts";
import client_connect from "../websocket/client_connect.ts";

export function Load_Button() {
  return (
    <button onClick={handle_click} class="load-button">
      🌳
    </button>
  );
}

 export const handle_click = async () => {
    const ip = `${INPUT_VALUE()}:8080`;
    try {
      const connected = await client_connect(ip).catch();
      if (connected) {
        await validate_db_tables(true);
        // Logic continues @
        // client_handle_resonse.ts
        // handle_greeting()
      } else {
        const exists = await old_data_exists().catch((e) => err(e));
        if (exists) {
          await _frontend_init_();
          SET_SHOW_WELCOME(false);
          await validate_db_tables(false);
          await frontend_update();
        }
      }
    } catch (error) {
      console.error(error);
    }

    SET_INPUT_VALUE("");
  };

const old_data_exists = async () => {
  const key = sql_get_key("home");
  const old_data = await sql_read_uint8array("buttons", key);
  return old_data != null;
};
