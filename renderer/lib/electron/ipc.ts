import { ipcRenderer } from "electron"

type RendererChannel = "open-file-dialog"

export const ipc = <T, U>(channel: RendererChannel, payload?: T): Promise<U> =>
  new Promise((resolve) => {
    ipcRenderer.once(channel, (_event, args: U) => {
      resolve(args)
    })

    ipcRenderer.send(channel, payload)
  })
