import frontend_update from "../_frontend_/frontend_update";
import { sql_upsert_wrapper } from "../sql/sql_upsert_wrapper";
import { err } from "../terminal/commands/logs";
import { SqlWrapper } from "../types";
import { set_border_highlight } from "../ui/border_highlight";

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

const on_completed = async () => {
  isIdle = true;
  if (Q.length === 0) {
    try {
      await set_border_highlight({ visible: false });
      await frontend_update();
    } catch (error) {
      console.error(error);
    }
  }
};

export default client_push_update;
