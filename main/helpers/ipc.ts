import { BrowserWindow, ipcMain, dialog } from "electron"
import type { OpenDialogOptions, SaveDialogOptions } from "electron"

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
  ipcMain.on("open-save-dialog", async (event, payload?: SaveDialogOptions) => {
    if (!mainWindow) {
      event.reply("open-save-dialog")
      return
    }

    const value = await dialog.showSaveDialog(mainWindow, {
      ...payload,
    })
    event.reply("open-save-dialog", value)
  })
}

type MainChannel =
  | "recieve-draft-path"
  | "save-draft"
  | "save-new-draft"
  | "toggle-color-theme"
  | "toggle-char-count"

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
