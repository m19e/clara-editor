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
