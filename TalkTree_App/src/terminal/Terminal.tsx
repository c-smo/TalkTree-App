import { createSignal, onMount } from "solid-js";
import exec from "./commands/_exec";
import { err, log, messages } from "./commands/logs";
import "./terminal.css";
import { TerminalLog } from "./terminal_types";

export const get_prefix = () => `${user}@${location}`;
export const [terminal_visible, set_terminal_visible] = createSignal(false);
const [command, set_command] = createSignal("");

const user = "tt5";
const location = "WebSocket-Client";

const handle_keydown = async (e: KeyboardEvent) => {
  if (e.key === "Enter" && command().trim() !== "" && terminal_visible()) {
    try {
      const argv = command().split(" ");
      await exec(argv);
      set_command("");
    } catch (error) {
      err(error);
    }
  }
};

const Terminal = () => {
  onMount(() => {
    hook();
    log(get_prefix());
  });

  return (
    <div
      classList={{
        terminal: terminal_visible(),
        hidden: !terminal_visible(),
        "display-none": !terminal_visible(),
      }}
    >
      <div class="terminal">
        {/* Logs */}
        <div class="logs-container">
          {messages().map((terminal_log: TerminalLog) =>
            terminal_log.type === "Terminal" ? (
              <div class="error-container">
                <span class="error-tag">[ERR]</span>
                <span class="error-message">{` ${terminal_log.content}`}</span>
              </div>
            ) : (
              <div class="log-message">{terminal_log.content}</div>
            ),
          )}
        </div>
        {/* Input Field */}
        <input
          id="auto_focus"
          class="input-field"
          type="text"
          value={command()}
          onInput={(e) => set_command(e.currentTarget.value)}
          onKeyDown={handle_keydown}
          placeholder=""
          autofocus
        />
      </div>
    </div>
  );
};

const hook = () => {
  const inputElement = document.getElementById(
    "auto_focus",
  )! as HTMLInputElement;

  document.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && terminal_visible()) {
      if (document.activeElement !== inputElement) {
        inputElement.select();
      }
    } else if (event.key === "Escape") {
      set_terminal_visible(!terminal_visible());
      if (terminal_visible()) {
        setTimeout(() => inputElement.focus(), 100);
      }
    }
  });
};

export default Terminal;
