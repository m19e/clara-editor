import { atom, DefaultValue } from "recoil"
import type { AtomEffect } from "recoil"
import Store from "electron-store"

import { FontType } from "@/types"

const isProd = process.env.NODE_ENV === "production"

const store = new Store()

type ElectronStoreEffect = <T>(key: string) => AtomEffect<T>

const appStoreEffect: ElectronStoreEffect =
  (key: string) =>
  ({ setSelf, onSet }) => {
    const value = store.get(key, new DefaultValue()) as any
    if (isProd) setSelf(value)

    onSet((newValue, _, isReset) => {
      isReset ? store.delete(key) : store.set(key, newValue)
    })
  }

// App
export const isFallbackState = atom({
  key: "app/is-fallback",
  default: false,
})

export const draftFilepathState = atom({
  key: "app/draft-filepath",
  default: "",
  effects: [appStoreEffect("draft-filepath")],
})

// Editor
export const fontTypeState = atom<FontType>({
  key: "editor/font-type",
  default: "mincho",
  effects: [appStoreEffect("font-type")],
})

export const fontSizeState = atom({
  key: "editor/font-size",
  default: 10,
  effects: [appStoreEffect("font-size")],
})

export const lineHeightState = atom({
  key: "editor/line-height",
  default: 20,
  effects: [appStoreEffect("line-height")],
})

export const lineWordsState = atom({
  key: "editor/line-words",
  default: 30,
  effects: [appStoreEffect("line-words")],
})

// View
