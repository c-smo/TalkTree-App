import { handle_click } from "../components/Load_Button";

const keyboard_hooks_init = () => {
  document.body.addEventListener("keydown", async (e) => {
    const map = {
      Enter: async () => {
        handle_click();
      },
    };
    const key = e.key as keyof typeof map;
    if (map[key]) map[key]();
  });
};

export default keyboard_hooks_init;
