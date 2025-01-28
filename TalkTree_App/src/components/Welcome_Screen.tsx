import { INPUT_VALUE, SET_INPUT_VALUE, SHOW_WELCOME } from "../globals";
import { Load_Button } from "./Load_Button";

export const Welcome_Screen = () => {
  return (
    <div class="app-container">
      <div class="input-area">
        <input
          style={{
            display: `${SHOW_WELCOME() ? "flex" : "none"}`,
            top: "10%",
          }}
          type="text"
          value={INPUT_VALUE()}
          onInput={(e) => SET_INPUT_VALUE(e.currentTarget.value)}
          placeholder="Baum-ID..."
          class="text-input"
        />
        <Load_Button />
      </div>
    </div>
  );
};
