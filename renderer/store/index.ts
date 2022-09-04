import { atom } from "recoil"

import { FontType } from "@/types"

// Editor
export const fontTypeState = atom<FontType>({
  key: "editor/font-type",
  default: "mincho",
})

export const fontSizeState = atom({
  key: "editor/font-size",
  default: 10,
})

export const lineHeightState = atom({
  key: "editor/line-height",
  default: 20,
})

export const lineWordsState = atom({
  key: "editor/line-words",
  default: 30,
})

// View
