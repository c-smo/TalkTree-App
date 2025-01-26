import { decode, encode } from "msgpackr";
import { Settings, TTSButton } from "../types";

export const msgpackr_encode_tts_button = (data: TTSButton[]): Uint8Array => {
  return encode(data);
};

export const msgpackr_decode_tts_button = (
  encodedData: Uint8Array,
): TTSButton[] => {
  return decode(encodedData) as TTSButton[];
};

export const msgpackr_decode_settings = (encodedData: Uint8Array): Settings => {
  return decode(encodedData) as Settings;
};
