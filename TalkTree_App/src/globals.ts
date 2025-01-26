import Database from "@tauri-apps/plugin-sql";
import { createSignal } from "solid-js";
import _frontend_init_ from "./_frontend_/_fontend_init_";
import { sql_create_uint8array_table } from "./sql/sql_create_unit8array_table";
import { err } from "./terminal/commands/logs";
import { Settings, TTSButton } from "./types";
import { msgpackr_decode_settings } from "./utils/msgpackr";

export const TABLE_NAMES = ["buttons", "images", "audio", "settings"] as const;

export const [CELLS, SET_CELLS] = createSignal<number[]>([]);

export const [SHOW_WELCOME, SET_SHOW_WELCOME] = createSignal(true);

export const [MESSAGES, SET_MESSAGES] = createSignal<string[]>([]);

export const [INPUT_VALUE, SET_INPUT_VALUE] = createSignal("");

export const [CURRENT_SHEET, SET_CURRENT_SHEET] = createSignal("home");

export const [CURRENT_PROPS, SET_CURRENT_PROPS] = createSignal(
  [] as TTSButton[],
);

export const [UPDATES, SET_UPDATES] = createSignal(0);

export let DB: Database;

export const SETTINGS: Settings = {
  rows: 6,
  cols: 3,
  aspect_ratio: "9:18",
  radius: 0.2,
  use_swipe: false,
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
  await _frontend_init_();
};

export const NEW_WORDS: string[] = [];

export const globals_clear_new_words = () => {
  while (NEW_WORDS.length) {
    NEW_WORDS.shift();
  }
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
