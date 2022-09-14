import { BrowserWindow, ipcMain, dialog } from "electron"
import type { OpenDialogOptions } from "electron"

export const addIpcListener = (mainWindow: BrowserWindow) => {
  ipcMain.on("open-file-dialog", async (event, payload?: OpenDialogOptions) => {
    if (!mainWindow) {
      event.reply("open-file-dialog")
      return
    }

    const value = await dialog.showOpenDialog(mainWindow, {
      ...payload,
    })
    event.reply("open-file-dialog", value)
  })
}

type MainChannel =
  | "recieve-draft-path"
  | "toggle-color-theme"
  | "save-draft"
  | "save-new-draft"

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
