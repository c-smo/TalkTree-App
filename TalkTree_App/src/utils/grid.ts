import { createSignal } from "solid-js";
import { SETTINGS } from "../globals";
import { Grid } from "../types";

const MARGIN_PERCENTAGE = 0.05;

export const [borderRadius, setBorderRadius] = createSignal(40);

export const GRID = {} as Grid;

export function create_grid() {
  const cols = SETTINGS.cols;
  const rows = SETTINGS.rows;
  const margin =
    Math.min(window.innerWidth, window.innerHeight) * MARGIN_PERCENTAGE;
  const gap = margin;

  const fn = (a: number, b: number) => (a - 2 * margin - (b - 1 * gap)) / b;

  const cell_height = fn(window.innerWidth, cols);
  const cell_width = fn(window.innerHeight, rows);

  Object.assign(GRID, { rows, cols, margin, gap, cell_height, cell_width });

  setBorderRadius(SETTINGS.radius * 50);

  const gc = document.querySelector(".grid-container")! as HTMLElement;

  gc.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
  gc.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  gc.style.width = `calc(100vw - ${margin * 2}px)`;
  gc.style.height = `calc(100vh - ${margin * 2}px)`;
  gc.style.margin = `${margin}px`;
  gc.style.gap = `${margin}px`;
}
