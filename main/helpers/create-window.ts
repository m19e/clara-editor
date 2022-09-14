import { screen, BrowserWindow, Menu, dialog } from "electron"
import type { BrowserWindowConstructorOptions } from "electron"
import Store from "electron-store"

import { addIpcListener, ipc } from "./ipc"

export const createWindow = (
  windowName: string,
  options: BrowserWindowConstructorOptions
): BrowserWindow => {
  const key = "window-state"
  const name = `window-state-${windowName}`
  const store = new Store({ name })
  const defaultSize = {
    width: options.width,
    height: options.height,
  }
  let state = {}

  const restore = () => store.get(key, defaultSize)

  const getCurrentPosition = () => {
    const position = win.getPosition()
    const size = win.getSize()
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    }
  }

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    )
  }

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    })
  }

  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds)
    })
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults()
    }
    return windowState
  }

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition())
    }
    store.set(key, state)
  }

  state = ensureVisibleOnSomeDisplay(restore())

  const browserOptions: BrowserWindowConstructorOptions = {
    ...options,
    ...state,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      ...options.webPreferences,
    },
  }
  const win = new BrowserWindow(browserOptions)

  const menu = Menu.buildFromTemplate([
    {
      label: "原稿",
      submenu: [
        {
          id: "open-draft",
          label: "開く…",
          accelerator: "CmdOrCtrl+O",
          click: async (_, win) => {
            const res = await dialog.showOpenDialog(win, {
              title: "ファイルを開く",
              filters: [
                {
                  name: "テキストファイル",
                  extensions: ["txt"],
                },
              ],
              properties: ["openFile"],
            })
            const { filePaths, canceled } = res
            if (canceled || filePaths.length !== 1) {
              return
            }
            const [fp] = filePaths
            await ipc<string, void>(win, "recieve-draft-path", fp)
          },
        },
        {
          id: "save-draft",
          label: "保存",
          accelerator: "CmdOrCtrl+S",
          click: (_, win) => {
            ipc(win, "save-draft")
          },
        },
        {
          id: "save-new-draft",
          label: "名前を付けて保存",
          accelerator: "CmdOrCtrl+Shift+S",
          click: async (_, win) => {
            const res = await dialog.showSaveDialog(win, {
              title: "名前を付けて保存",
              filters: [
                {
                  name: "テキストファイル",
                  extensions: ["txt"],
                },
              ],
              defaultPath: "無題.txt",
            })
            const { canceled, filePath } = res
            if (canceled) return
            await ipc(win, "save-new-draft", filePath)
          },
        },
      ],
    },
    {
      label: "設定",
      submenu: [
        {
          id: "dark-mode",
          label: "ダークモード",
          click: async (_, win) => {
            if (win) {
              await ipc<"light" | "dark", void>(win, "toggle-color-theme")
            }
          },
        },
      ],
    },
  ])
  Menu.setApplicationMenu(menu)

  addIpcListener(win)

  win.on("close", saveState)

  return win
}

export default createWindow
