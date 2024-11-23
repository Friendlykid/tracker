import { atom } from "recoil";

export const modeAtom = atom({
  key: "mode",
  default: "dark",
});

export const loginAtom = atom({
  key: "loginDialog",
  default: false,
});
