import { ipcRenderer } from "electron"
import { useEffect } from "react"
import { useTheme } from "next-themes"

import { useDraftPath } from "@/hooks"

export const IpcListener = () => {
  const { theme, setTheme } = useTheme()
  const [, setDraftPath] = useDraftPath()

  useEffect(() => {
    ipcRenderer.on("toggle-color-theme", () => {
      setTheme(theme === "dark" ? "light" : "dark")
    })
    ipcRenderer.on("recieve-draft-path", (_, payload: string) => {
      setDraftPath(payload)
    })
  }, [theme])

  return null
}
