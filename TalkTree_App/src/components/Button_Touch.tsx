import { SETTINGS } from "../globals";
import { inside_margin } from "../utils/helpers";
import { click_action, trigger_action } from "./Button_Action";

const handle_touch = (
  e: TouchEvent,
  index: number,
  setIsDragging: (dragging: boolean) => void,
  isDragging: () => boolean,
  setPos: (pos: { x: number; y: number }) => void,
  setZindex: (zIndex: number) => void,
  set_is_clicked: (b: boolean) => void,
) => {
  const startX = e.touches[0].pageX;
  const startY = e.touches[0].pageY;

  const onTouchMove = (e: TouchEvent) => {
    const x = e.touches[0].pageX - startX;
    const y = e.touches[0].pageY - startY;
    setPos({ x: x, y: y });

    if (inside_margin(e.touches[0].pageX, e.touches[0].pageY) && isDragging()) {
      clean();
      void trigger_action(index);
    }
  };

  const onTouchEnd = () => {
    clean();
  };

  const clean = () => {
    setIsDragging(false);
    setZindex(500);
    setPos({ x: 0, y: 0 });
    document.removeEventListener("touchmove", onTouchMove);
    document.removeEventListener("touchend", onTouchEnd);
  };

  if (SETTINGS.use_swipe) {
    document.addEventListener("touchmove", onTouchMove);
    document.addEventListener("touchend", onTouchEnd);
    setIsDragging(true);
  } else {
    clean();
    void click_action(index, set_is_clicked);
  }
};

export default handle_touch;
