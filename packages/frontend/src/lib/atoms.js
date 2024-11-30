import { atom } from "recoil";
import { ETHEREUM } from "./constants";

export const modeAtom = atom({
  key: "mode",
  default: "dark",
});

export const loginAtom = atom({
  key: "loginDialog",
  default: false,
});

export const selectTokenAtom = atom({
  key: "selectToken",
  default: ETHEREUM,
});
