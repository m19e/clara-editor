import { writeFile } from "fs/promises"
import type { SaveDialogOptions, SaveDialogReturnValue } from "electron"
import { useEffect, useRef } from "react"
import { $getRoot } from "lexical"
import type { EditorState } from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { ipc, mergeRegister, registerIpcFromMain } from "@/lib/electron/ipc"
import { useDraftPath, useIsSaved } from "@/hooks"

const isProd = process.env.NODE_ENV === "production"

const getTextFromEditorState = (editorState: EditorState) => {
  return editorState.read(() => $getRoot().getTextContent(true, false))
}

const saveDraft = async (
  filepath: string,
  editorState: EditorState
): Promise<null | string> => {
  if (!isProd) return

  const text = getTextFromEditorState(editorState)
  try {
    await writeFile(filepath, text)
    return null
  } catch (error) {
    return JSON.stringify(error)
  }
}

export const AutoSavePlugin = (): null => {
  const [editor] = useLexicalComposerContext()
  const [draftPath, setDraftPath] = useDraftPath()
  const [, setIsSaved] = useIsSaved()

  const shouldSave = useRef(false)

  let timerId: NodeJS.Timeout | null = null

  const createAndSaveDraft = async (editorState: EditorState) => {
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

    const err = await saveDraft(filePath, editorState)
    if (err) return

    setDraftPath(filePath)
    setIsSaved(true)
  }

  useEffect(() => {
    shouldSave.current = false

    return mergeRegister(
      registerIpcFromMain("save-draft", async () => {
        if (draftPath === "") {
          await createAndSaveDraft(editor.getEditorState())
          return
        }

        if (timerId !== null) {
          clearTimeout(timerId)
        }
        const err = await saveDraft(draftPath, editor.getEditorState())
        if (err) return
        setIsSaved(true)
      }),
      registerIpcFromMain("save-new-draft", async (_, payload: string) => {
        if (timerId !== null) {
          clearTimeout(timerId)
        }
        const err = await saveDraft(payload, editor.getEditorState())
        if (err) return
        setDraftPath(payload)
      })
    )
  }, [editor, draftPath, timerId, createAndSaveDraft])

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
        timerId = setTimeout(() => {
          ;(async () => {
            const err = await saveDraft(draftPath, editorState)
            if (err) return
            setIsSaved(true)
          })()
        }, 5000)
      }
    )
  }, [editor, draftPath])

  return null
}
