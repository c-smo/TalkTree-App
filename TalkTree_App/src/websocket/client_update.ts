import frontend_update from "../_frontend_/frontend_update";
import {
  CURRENT_PROPS,
  SET_CURRENT_PROPS,
  SET_UPDATE_AMOUNT,
  SETTINGS,
  UPDATE_AMOUNT,
} from "../globals";
import { sql_upsert_wrapper } from "../sql/sql_upsert_wrapper";
import { err } from "../terminal/commands/logs";
import { SqlWrapper } from "../types";
import { set_border_highlight } from "../ui/border_highlight";
import { websocket_request } from "./client_request";

let isIdle = true;

const Q = [] as SqlWrapper[];

export const client_push_update = (wrapper: SqlWrapper) => {
  Q.push(wrapper);
  void update();
};

const update = async () => {
  await set_border_highlight({ visible: true });
  if (isIdle === false) return;
  isIdle = false;
  while (Q.length) {
    display_remaining();
    const wrapper = Q.shift();
    if (wrapper) {
      try {
        await sql_upsert_wrapper(wrapper);
      } catch (error) {
        err(error);
        continue;
      }
    }
  }
  on_completed();
};

const display_remaining = async () => {
  SET_UPDATE_AMOUNT(UPDATE_AMOUNT() - 1);
  const index = Math.floor((SETTINGS.cols - 1) / 2) + SETTINGS.cols;
  const props = CURRENT_PROPS();
  if (index < props.length) {
    UPDATE_AMOUNT() > 0
      ? (props[index].symbol = `${UPDATE_AMOUNT()}`)
      : (props[index].symbol = "-");
    props[index].color = SETTINGS.default_colors.button;
  }
  SET_CURRENT_PROPS([...props]);
};

const on_completed = async () => {
  isIdle = true;
  if (UPDATE_AMOUNT() === 0) {
    try {
      await set_border_highlight({ visible: false });
      await frontend_update();
      await websocket_request("fin", "x");
    } catch (error) {
      console.error(error);
    }
  }
};

export default client_push_update;
