import { screen, BrowserWindow, Menu, dialog } from "electron"
import type {
  BrowserWindowConstructorOptions,
  MenuItemConstructorOptions,
  MenuItem,
} from "electron"
import Store from "electron-store"
import contextMenu from "electron-context-menu"

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

  ;(async () => {
    const menu = await createMenu(win)
    Menu.setApplicationMenu(menu)
  })()

  contextMenu({
    prepend: (_, { isEditable }) => [
      {
        id: "undo",
        label: "元に戻す　　Ctrl+Z",
        visible: isEditable,
        click: async () => {
          await ipc(win, "undo")
        },
      },
      {
        id: "redo",
        label: "やり直し　　Ctrl+Y",
        visible: isEditable,
        click: async () => {
          await ipc(win, "redo")
        },
      },
    ],
    labels: {
      cut: "切り取り　　Ctrl+X",
      copy: "コピー　　　Ctrl+C",
      paste: "貼り付け　　Ctrl+V",
    },
    append: (_, { isEditable }) => [
      {
        id: "select-all",
        label: "すべて選択　Ctrl+A",
        visible: isEditable,
        click: async () => {
          await ipc(win, "select-all")
        },
      },
    ],
    showSelectAll: false,
    showSearchWithGoogle: false,
    showInspectElement: false,
  })

  addIpcListener(win)

  win.on("close", saveState)

  return win
}

type Theme = "light" | "dark"

const createMenu = async (win: BrowserWindow) => {
  const theme = await getThemeFromLocalStorage(win)

  const template: (MenuItemConstructorOptions | MenuItem)[] = [
    {
      label: "ファイル",
      submenu: [
        {
          id: "open-draft",
          label: "開く",
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
      label: "表示",
      submenu: [
        {
          id: "dark-mode",
          label: "ダークモード",
          accelerator: "CmdOrCtrl+Shift+D",
          type: "checkbox",
          checked: theme === "dark",
          click: async (_, win) => {
            if (win) {
              await ipc(win, "toggle-color-theme")
            }
          },
        },
        {
          id: "char-count",
          label: "字数カウント",
          accelerator: "CmdOrCtrl+Shift+L",
          type: "checkbox",
          checked: true,
          click: async (_, win) => {
            await ipc(win, "toggle-char-count")
          },
        },
        {
          id: "line-number",
          label: "行番号",
          type: "checkbox",
          checked: true,
          click: (_, win) => {
            ipc(win, "toggle-line-number")
          },
        },
        {
          type: "separator",
        },
        {
          label: "全画面",
          sublabel: "Escで戻る",
          accelerator: process.platform === "darwin" ? "Ctrl+Cmd+F" : "F11",
          click: (_, win) => {
            if (win) {
              const isF = win.isFullScreen()
              win.setFullScreen(!isF)
              win.setMenuBarVisibility(isF)
            }
          },
        },
        {
          label: "全画面解除",
          accelerator: "Esc",
          visible: false,
          click: (_, win) => {
            if (win && win.isFullScreen()) {
              win.setFullScreen(false)
              win.setMenuBarVisibility(true)
            }
          },
        },
      ],
    },
  ]

  return Menu.buildFromTemplate(template)
}

const getThemeFromLocalStorage = async (win: BrowserWindow): Promise<Theme> => {
  return (
    ((await win.webContents.executeJavaScript("({...localStorage});", true))
      .theme as Theme) || "light"
  )
}

export default createWindow
