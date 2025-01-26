import { CELLS, CURRENT_PROPS, CURRENT_SHEET } from "../../globals";
import { log } from "./logs";

export const page_info = (arg: string) => {
  if (arg === "current") {
    log(CURRENT_SHEET());
  } else if (arg === "all") {
    const props = CURRENT_PROPS();
    for (let button of props) {
      const json = JSON.stringify(button);
      log(`> ${json}`);
    }
  } else if (arg === "cells") {
    log(`Cells: ${CELLS().length}`);
  }
};
