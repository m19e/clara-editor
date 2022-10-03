import { ipcRenderer } from "electron"
import type { IpcRendererEvent } from "electron"

type RendererChannel = "open-file-dialog" | "open-save-dialog"

export const ipc = <T, U>(channel: RendererChannel, payload?: T): Promise<U> =>
  new Promise((resolve) => {
    ipcRenderer.once(channel, (_event, args: U) => {
      resolve(args)
    })

    ipcRenderer.send(channel, payload)
  })

type Func = () => void

export const mergeRegister = (...func: Array<Func>): Func => {
  return () => func.forEach((f) => f())
}

type MainChannel =
  | "recieve-draft-path"
  | "save-draft"
  | "save-new-draft"
  | "toggle-color-theme"
  | "toggle-char-count"
  | "select-all"
  | "undo"
  | "redo"

export const registerIpcListener = (
  channel: MainChannel,
  listener: (event: IpcRendererEvent, ...args: any[]) => void
): Func => {
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeAllListeners(channel)
}
