import { writeFile } from "fs/promises"
import { ipcRenderer } from "electron"
import type { SaveDialogOptions, SaveDialogReturnValue } from "electron"
import { useEffect, useRef } from "react"
import { $getRoot } from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { ipc } from "@/lib/electron/ipc"
import { useDraftPath, useIsSaved } from "@/hooks"

const isProd = process.env.NODE_ENV === "production"

export const AutoSavePlugin = (): null => {
  const [editor] = useLexicalComposerContext()
  const [draftPath, setDraftPath] = useDraftPath()
  const [, setIsSaved] = useIsSaved()

  const shouldSave = useRef(false)

  let timerId: NodeJS.Timeout | null = null

  useEffect(() => {
    ipcRenderer.on("save-draft", async () => {
      if (draftPath === "") {
        const res = await ipc<SaveDialogOptions, SaveDialogReturnValue>(
          "open-save-dialog",
          {
            title: "名前を付けて保存",
            filters: [
              {
                name: "テキストファイル",
                extensions: ["txt"],
              },
            ],
            defaultPath: "無題.txt",
          }
        )
        const { filePath, canceled } = res
        if (canceled) return
        try {
          const text = editor
            .getEditorState()
            .read(() =>
              $getRoot().getTextContent(true, false).replace(/\n\n/g, "\n")
            )
          await writeFile(filePath, text)
          setDraftPath(filePath)
          setIsSaved(true)
        } catch (error) {
          console.error(error)
        }
        return
      }

      if (timerId !== null) {
        clearTimeout(timerId)
      }
      const text = editor
        .getEditorState()
        .read(() =>
          $getRoot().getTextContent(true, false).replace(/\n\n/g, "\n")
        )
      try {
        await writeFile(draftPath, text)
        setIsSaved(true)
      } catch (error) {
        console.error(error)
      }
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
      try {
        await writeFile(payload, text)
        setDraftPath(payload)
      } catch (error) {
        console.error(error)
      }
    })
  }, [draftPath])

  useEffect(() => {
    shouldSave.current = false
  }, [draftPath])

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
        if (!shouldSave.current) {
          shouldSave.current = true
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
