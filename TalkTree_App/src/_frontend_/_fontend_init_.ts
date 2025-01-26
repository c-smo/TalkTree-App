import { SETTINGS } from "../globals";
import { create_grid } from "../utils/grid";
import { cells } from "./__main__";

const _frontend_init_ = async () => {
  create_grid();
  init_cells();
};

const init_cells = () => {
  if (cells.length > 0) {
    console.warn("cells: double init");
    return;
  }
  for (let i = 0; i < SETTINGS.cols * SETTINGS.rows; i++) {
    cells.push(i);
  }
};

export default _frontend_init_;
