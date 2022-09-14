import { writeFile } from "fs/promises"
import { ipcRenderer } from "electron"
import { useEffect } from "react"
import { $getRoot } from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { useDraftPath, useIsSaved } from "@/hooks"

const isProd = process.env.NODE_ENV === "production"

export const AutoSavePlugin = (): null => {
  const [editor] = useLexicalComposerContext()
  const [draftPath] = useDraftPath()
  const [, setIsSaved] = useIsSaved()

  let timerId: NodeJS.Timeout | null = null

  useEffect(() => {
    ipcRenderer.on("save-draft", async () => {
      if (draftPath === "") return
      if (timerId !== null) {
        clearTimeout(timerId)
      }
      const text = editor
        .getEditorState()
        .read(() =>
          $getRoot().getTextContent(true, false).replace(/\n\n/g, "\n")
        )
      await writeFile(draftPath, text)
      setIsSaved(true)
    })
    ipcRenderer.on("save-new-draft", async (_, payload: string) => {
      if (timerId !== null) {
        clearTimeout(timerId)
      }
      const text = editor
        .getEditorState()
        .read(() =>
          $getRoot().getTextContent(true, false).replace(/\n\n/g, "\n")
        )
      await writeFile(payload, text)
    })
  }, [])

  useEffect(() => {
    return editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves, prevEditorState }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
          return
        }
        if (prevEditorState.isEmpty()) {
          return
        }
        if (draftPath === "") {
          return
        }

        setIsSaved(false)
        if (timerId !== null) {
          clearTimeout(timerId)
        }
        try {
          // eslint-disable-next-line react-hooks/exhaustive-deps
          timerId = setTimeout(() => {
            editorState.read(async () => {
              const text = $getRoot()
                .getTextContent(true, false)
                .replace(/\n\n/g, "\n")
              if (isProd) await writeFile(draftPath, text)
              setIsSaved(true)
            })
          }, 5000)
        } catch (error) {
          console.error(error)
        }
      }
    )
  }, [editor, draftPath])

  return null
}
