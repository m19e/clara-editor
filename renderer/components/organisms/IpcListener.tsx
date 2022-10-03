import { ipcRenderer } from "electron"
import { useEffect } from "react"
import { useTheme } from "next-themes"
import { $getSelection, $isRangeSelection } from "lexical"
import { $selectAll } from "@lexical/selection"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { useDisplayCharCount, useDraftPath } from "@/hooks"

export const IpcListener = () => {
  const { theme, setTheme } = useTheme()
  const [, setDraftPath] = useDraftPath()
  const [, setDisplayCharCount] = useDisplayCharCount()

  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    ipcRenderer.on("toggle-color-theme", () => {
      setTheme(theme === "dark" ? "light" : "dark")
    })

    return () => {
      ipcRenderer.removeAllListeners("toggle-color-theme")
    }
  }, [theme])

  useEffect(() => {
    ipcRenderer.on("recieve-draft-path", (_, payload: string) => {
      setDraftPath(payload)
    })
    ipcRenderer.on("toggle-char-count", () => {
      setDisplayCharCount((prev) => !prev)
    })
    ipcRenderer.on("select-all", () => {
      editor.update(() => {
        const selection = $getSelection()
        if ($isRangeSelection(selection)) {
          $selectAll(selection)
        }
      })
    })

    return () => {
      ipcRenderer.removeAllListeners("recieve-draft-path")
      ipcRenderer.removeAllListeners("toggle-char-count")
      ipcRenderer.removeAllListeners("select-all")
    }
  }, [])

  return null
}
