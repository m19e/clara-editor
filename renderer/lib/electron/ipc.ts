import { ipcRenderer } from "electron"

type Channel = "open-file-dialog"

export const ipc = <T, U>(channel: Channel, payload?: T): Promise<U> =>
  new Promise((resolve) => {
    ipcRenderer.once(channel, (_event, args: U) => {
      resolve(args)
    })

    ipcRenderer.send(channel, payload)
  })
