import { useEffect } from "react"
import { useTheme } from "next-themes"
import {
  $getSelection,
  $isRangeSelection,
  UNDO_COMMAND,
  REDO_COMMAND,
} from "lexical"
import { $selectAll } from "@lexical/selection"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { mergeRegister, registerIpcFromMain } from "@/lib/electron/ipc"
import {
  useDisplayCharCount,
  useDisplayLineNumber,
  useDraftPath,
} from "@/hooks"

export const IpcListener = () => {
  const { theme, setTheme } = useTheme()
  const [, setDraftPath] = useDraftPath()
  const [, setDisplayCharCount] = useDisplayCharCount()
  const [, setDisplayLineNumber] = useDisplayLineNumber()

  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      registerIpcFromMain("toggle-color-theme", () => {
        setTheme(theme === "dark" ? "light" : "dark")
      }),
      registerIpcFromMain("recieve-draft-path", (_, payload: string) => {
        setDraftPath(payload)
      }),
      registerIpcFromMain("toggle-char-count", () => {
        setDisplayCharCount((prev) => !prev)
      }),
      registerIpcFromMain("toggle-line-number", () => {
        setDisplayLineNumber((prev) => !prev)
      }),
      registerIpcFromMain("select-all", () => {
        editor.update(() => {
          const selection = $getSelection()
          if ($isRangeSelection(selection)) {
            $selectAll(selection)
          }
        })
      }),
      registerIpcFromMain("undo", () => {
        editor.dispatchCommand(UNDO_COMMAND, undefined)
      }),
      registerIpcFromMain("redo", () => {
        editor.dispatchCommand(REDO_COMMAND, undefined)
      })
    )
  }, [theme, editor])

  return null
}
