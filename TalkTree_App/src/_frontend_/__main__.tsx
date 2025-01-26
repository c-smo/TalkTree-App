import { onMount } from "solid-js";
import { Cell } from "../components/Grid_Cell";
import { Welcome_Screen } from "../components/Welcome_Screen";
import {
  globals_init_db,
  SET_CURRENT_PROPS,
  SET_SHOW_WELCOME,
  SHOW_WELCOME,
} from "../globals";
import keyboard_hooks_init from "../hooks/keyboard";
import { err } from "../terminal/commands/logs";
import Terminal from "../terminal/Terminal";
import { get_ghost_array } from "./frontend_update";

export const cells: number[] = [];

export function App() {
  onMount(async () => {
    SET_CURRENT_PROPS(get_ghost_array());
    keyboard_hooks_init()
    await globals_init_db().catch((e) => err(e));
    SET_SHOW_WELCOME(true);
  });

  return (
    <div>
      <Terminal />
      {SHOW_WELCOME() && <Welcome_Screen />}
      <div class="grid-container">
        {SHOW_WELCOME() === false && (
          <>
            {cells.map((i) => (
              <Cell index={i} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
