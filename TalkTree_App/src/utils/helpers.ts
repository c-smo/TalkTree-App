import { err } from "../terminal/commands/logs";
import { GRID } from "./grid";

export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

export const sql_string_to_uint8Array = (value: string): Uint8Array => {
  try {
    const array = JSON.parse(value) as number[];

    if (
      !Array.isArray(array) ||
      !array.every((n) => Number.isInteger(n) && n >= 0 && n <= 255)
    ) {
      throw new Error("Invalid array data for Uint8Array conversion");
    }

    return new Uint8Array(array);
  } catch (error) {
    err(error);
    throw error;
  }
};

export const uint8array_to_base64 = (buffer: Uint8Array): string => {
  let binary = "";
  const len = buffer.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(buffer[i]);
  }
  return `data:image/png;base64,${btoa(binary)}`;
};

export const inside_margin = (x: number, y: number): boolean => {
  const m = GRID.margin * 0.5;
  const w = GRID.cell_width * 0.4;
  const h = GRID.cell_height * 0.4;

  return (
    x - w < m ||
    x + w > window.innerWidth - m ||
    y - h < m ||
    y + h > window.innerHeight - m
  );
};

export const set_css_global = (name: string, value: string) => {
  document.documentElement.style.setProperty(name, value);
};
