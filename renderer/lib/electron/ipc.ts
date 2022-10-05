import { ipcRenderer } from "electron"
import type { IpcRendererEvent } from "electron"
import type { RendererChannel, MainChannel } from "common/types"

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

export const registerIpcFromMain = (
  channel: MainChannel,
  listener: (event: IpcRendererEvent, ...args: any[]) => void
): Func => {
  ipcRenderer.on(channel, listener)
  return () => ipcRenderer.removeAllListeners(channel)
}
