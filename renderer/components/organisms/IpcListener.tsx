import { useEffect } from "react"
import { useTheme } from "next-themes"
import { $getSelection, $isRangeSelection } from "lexical"
import { $selectAll } from "@lexical/selection"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { mergeRegister, registerIpcListener } from "@/lib/electron/ipc"
import { useDisplayCharCount, useDraftPath } from "@/hooks"

export const IpcListener = () => {
  const { theme, setTheme } = useTheme()
  const [, setDraftPath] = useDraftPath()
  const [, setDisplayCharCount] = useDisplayCharCount()

  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      registerIpcListener("toggle-color-theme", () => {
        setTheme(theme === "dark" ? "light" : "dark")
      }),
      registerIpcListener("recieve-draft-path", (_, payload: string) => {
        setDraftPath(payload)
      }),
      registerIpcListener("toggle-char-count", () => {
        setDisplayCharCount((prev) => !prev)
      }),
      registerIpcListener("select-all", () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $selectAll(selection)
          }
        })
      })
    )
  }, [theme, editor])

  return null
}
