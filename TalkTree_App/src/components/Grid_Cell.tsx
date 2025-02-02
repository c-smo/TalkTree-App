import { createSignal, onMount } from "solid-js";
import { SETTINGS } from "../globals";
import { GRID } from "../utils/grid";
import { set_css_global } from "../utils/helpers";
import { Button_Container } from "./_Button_Container";
import Button_Subtitle from "./Button_Subtitle";

export const Cell = (props: { index: number }) => {
  const [is_dragging, set_is_dragging] = createSignal(false);
  const [pos, set_pos] = createSignal({ x: 0, y: 0 });
  const [z_index, set_z_index] = createSignal(0);
  const [is_clicked, set_is_clicked] = createSignal(false);

  onMount(() => {
    set_css_global(
      "--global-subtitle-size",
      `${Math.floor(GRID.cell_height * 0.2)}px`,
    );
  });

  return (
    <div
      class="grid-cell"
      style={{
        "border-radius": `${SETTINGS.radius * 50}%`,
      }}
    >
      <Button_Container
        index={props.index}
        is_dragging={is_dragging}
        set_is_dragging={set_is_dragging}
        pos={pos}
        set_pos={set_pos}
        z_index={z_index}
        set_z_index={set_z_index}
        is_clicked={is_clicked}
        set_is_clicked={set_is_clicked}
      />
      <Button_Subtitle index={props.index} is_clicked={is_clicked} />
    </div>
  );
};
