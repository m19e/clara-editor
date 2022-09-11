import { writeFile } from "fs/promises"
import { useEffect } from "react"
import { $getRoot } from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { useDraftPath } from "@/hooks"

type PlainTextChild = { type: "text"; text: string } | { type: "linebreak" }

const isProd = process.env.NODE_ENV === "production"

export const AutoSavePlugin = (): null => {
  const [editor] = useLexicalComposerContext()
  const [draftPath] = useDraftPath()

  let timerId: NodeJS.Timeout | null = null

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
        try {
          if (timerId !== null) {
            clearTimeout(timerId)
          }
          // eslint-disable-next-line react-hooks/exhaustive-deps
          timerId = setTimeout(() => {
            editorState.read(async () => {
              const text = $getRoot()
                .getTextContent(true, false)
                .replace(/\n\n/g, "\n")
              if (isProd) await writeFile(draftPath, text)
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
