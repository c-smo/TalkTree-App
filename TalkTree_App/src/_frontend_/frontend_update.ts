import { CURRENT_SHEET, SET_CURRENT_PROPS, SETTINGS } from "../globals";
import sql_get_key from "../sql/sql_get_key";
import sql_read_uint8array from "../sql/sql_read_unit8array";
import { err } from "../terminal/commands/logs";
import { TTSButton } from "../types";
import { set_grid_cell_size } from "../utils/grid";
import { msgpackr_decode_tts_button } from "../utils/msgpackr";

const frontend_update = async () => {
  try {
    const key = sql_get_key(CURRENT_SHEET());
    const uint8array = (await sql_read_uint8array(
      "buttons",
      key,
    )) as Uint8Array;

    const buffer_array = get_ghost_array();
    if (uint8array) {
      msgpackr_decode_tts_button(uint8array).map((button) => {
        buffer_array[button.button_index] = button;
      });
    }
    set_grid_cell_size()
    SET_CURRENT_PROPS([...buffer_array]);
  } catch (error) {
    err(error);
  }
};

export const get_ghost_array = (): TTSButton[] => {
  return new Array(SETTINGS.cols * SETTINGS.rows)
    .fill("")
    .map(() => get_ghost_button());
};

const get_ghost_button = (): TTSButton => {
  return {
    sheet_key: "-",
    symbol: "-",
    tts: "-",
    subtitle: "-",
    color: "-",
    link: "-",
    button_index: 0,
    is_emoji: false,
  };
};

export default frontend_update;
