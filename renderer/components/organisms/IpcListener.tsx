import { ipcRenderer } from "electron"
import { useEffect } from "react"
import { useTheme } from "next-themes"

import { useDraftPath } from "@/hooks"

export const IpcListener = () => {
  const [, setDraftPath] = useDraftPath()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    ipcRenderer.on("recieve-draft-path", async (_, payload: string) => {
      setDraftPath(payload)
    })
    ipcRenderer.on("toggle-color-theme", async () => {
      setTheme(theme === "dark" ? "light" : "dark")
    })
  }, [theme])

  return null
}
