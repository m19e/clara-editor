import { writeFile } from "fs/promises"
import { useEffect } from "react"
import { $getRoot } from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { useDraftPath } from "@/hooks"

export const AutoSavePlugin = (): null => {
  const [editor] = useLexicalComposerContext()
  const [draftPath] = useDraftPath()

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
        ;(async () => {
          try {
            const text = editorState.read(() => $getRoot().getTextContent())
            await new Promise((resolve) => setTimeout(resolve, 5000))
            await writeFile(draftPath, text)
            console.log("Save draft to: ", draftPath)
          } catch (error) {
            console.error(error)
          }
        })()
      }
    )
  }, [editor, draftPath])

  return null
}
