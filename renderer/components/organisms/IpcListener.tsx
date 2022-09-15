import { ipcRenderer } from "electron"
import { useEffect } from "react"
import { useTheme } from "next-themes"

import { useDisplayCharCount, useDraftPath } from "@/hooks"

export const IpcListener = () => {
  const { theme, setTheme } = useTheme()
  const [, setDraftPath] = useDraftPath()
  const [, setDisplayCharCount] = useDisplayCharCount()

  useEffect(() => {
    ipcRenderer.on("recieve-draft-path", (_, payload: string) => {
      setDraftPath(payload)
    })
    ipcRenderer.on("toggle-color-theme", () => {
      setTheme(theme === "dark" ? "light" : "dark")
    })
    ipcRenderer.on("toggle-char-count", () => {
      setDisplayCharCount((prev) => !prev)
    })

    return () => {
      ipcRenderer.removeAllListeners("recieve-draft-path")
      ipcRenderer.removeAllListeners("toggle-color-theme")
      ipcRenderer.removeAllListeners("toggle-char-count")
    }
  }, [theme])

  return null
}
