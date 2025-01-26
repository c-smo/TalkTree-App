import { invoke } from "@tauri-apps/api/core";
import sql_get_key from "../sql/sql_get_key";
import sql_read_uint8array from "../sql/sql_read_unit8array";
import { err } from "../terminal/commands/logs";
import { TTSButton } from "../types";

export const tts_read = async (button: TTSButton): Promise<void> => {
  if (button.tts === "-") return;
  try {
    const key = sql_get_key(button.tts);

    const uint8array = (await sql_read_uint8array("audio", key)) as Uint8Array;
    if (uint8array) {
      await tts_from_sql(uint8array).catch((e) => err(e));
    } else {
      void tts_os_internal(button.tts).catch((e) => err(e));
    }
  } catch (e) {
    err(e);
  }
};

const tts_from_sql = async (uint8array: Uint8Array) => {
  const blob = new Blob([uint8array], { type: "audio/mp3" });
  const audioUrl = URL.createObjectURL(blob);
  await new Audio(audioUrl).play().catch((e) => err(e));
};

const tts_os_internal = async (text: string) => {
  void invoke("plugin:tts|speak", { text }).catch((e) => err(e));

  //await invoke("plugin:tts|speak", { text: `${text}`, language: "GERMANY"}).catch(e => err(e))

  // const utterance = new SpeechSynthesisUtterance(text);
  // utterance.lang = "de-DE";
  // utterance.pitch = 1;
  // utterance.rate = 1;
  // window.speechSynthesis.speak(utterance);
};
