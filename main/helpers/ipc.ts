import { BrowserWindow, ipcMain, dialog } from "electron"
import type {
  IpcMainEvent,
  OpenDialogOptions,
  SaveDialogOptions,
} from "electron"
import type { RendererChannel, MainChannel } from "common/types"

const registerIpcFromRenderer = (
  channel: RendererChannel,
  listener: (event: IpcMainEvent, ...args: any[]) => void
): void => {
  ipcMain.on(channel, listener)
}

export const addIpcListener = (mainWindow: BrowserWindow) => {
  registerIpcFromRenderer(
    "open-file-dialog",
    async (event, payload?: OpenDialogOptions) => {
      if (!mainWindow) {
        event.reply("open-file-dialog")
        return
      }

      const value = await dialog.showOpenDialog(mainWindow, {
        ...payload,
      })
      event.reply("open-file-dialog", value)
    }
  )
  registerIpcFromRenderer(
    "open-save-dialog",
    async (event, payload?: SaveDialogOptions) => {
      if (!mainWindow) {
        event.reply("open-save-dialog")
        return
      }

      const value = await dialog.showSaveDialog(mainWindow, {
        ...payload,
      })
      event.reply("open-save-dialog", value)
    }
  )
}

export const ipc = <T, U>(
  mainWindow: BrowserWindow,
  channel: MainChannel,
  payload?: T
): Promise<U> =>
  new Promise((resolve) => {
    ipcMain.once(channel, (_event, args: U) => {
      resolve(args)
    })

    mainWindow.webContents.send(channel, payload)
  })
