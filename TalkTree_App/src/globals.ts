import Database from "@tauri-apps/plugin-sql";
import { createSignal } from "solid-js";
import _frontend_init_ from "./_frontend_/_fontend_init_";
import { sql_create_uint8array_table } from "./sql/sql_create_unit8array_table";
import { err } from "./terminal/commands/logs";
import { Settings, TTSButton } from "./types";
import { set_css_global } from "./utils/helpers";
import { msgpackr_decode_settings } from "./utils/msgpackr";

export const TABLE_NAMES = ["buttons", "audio", "settings"] as const;

export const [UPDATE_AMOUNT, SET_UPDATE_AMOUNT] = createSignal(0);

export const [CELLS, SET_CELLS] = createSignal<number[]>([]);

export const [SHOW_WELCOME, SET_SHOW_WELCOME] = createSignal(true);

export const [MESSAGES, SET_MESSAGES] = createSignal<string[]>([]);

export const [INPUT_VALUE, SET_INPUT_VALUE] = createSignal("");

export const [CURRENT_SHEET, SET_CURRENT_SHEET] = createSignal("home");

export const [CURRENT_PROPS, SET_CURRENT_PROPS] = createSignal(
  [] as TTSButton[],
);
export let DB: Database;

export const SETTINGS: Settings = {
  rows: 6,
  cols: 3,
  aspect_ratio: "9:18",
  radius: 0.2,
  use_swipe: false,
  emoji_size: 0.7,
  server_ip: "-",
  default_colors: {
    background: "#2c3e50",
    button: "#3498db",
    text: "#FFFFFF",
  },
};

export const globals_init_settings = async (
  encoded_settings: string,
): Promise<void> => {
  const uint8Array = new Uint8Array(encoded_settings.split(",").map(Number));
  const settings = msgpackr_decode_settings(uint8Array);
  Object.assign(SETTINGS, { ...settings });
  set_css_global("--global-emoji-size", `${100 * SETTINGS.emoji_size}%`);

  await _frontend_init_();
};

export const globals_init_db = async (): Promise<void> => {
  DB = await Database.load("sqlite:talktree.db");
};

export const validate_db_tables = async (refresh: boolean = false) => {
  //TODO: Only refresh if hashes dont match
  try {
    for (let table_name of TABLE_NAMES) {
      await sql_create_uint8array_table(table_name, refresh);
    }
  } catch (error) {
    err(error);
  }
};
