import { readFile } from "fs/promises"
import type { FC } from "react"
import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { IS_PROD } from "common/consts"
import { $setTextContent } from "@/lib/lexical"
import { useIsFallback, useDraftPath } from "@/hooks"

export const AutoLoadPlugin: FC = () => {
  const [editor] = useLexicalComposerContext()
  const [, setIsFallback] = useIsFallback()
  const [draftPath, setDraftPath] = useDraftPath()

  useEffect(() => {
    const f = async () => {
      try {
        const draft = await readFile(draftPath, { encoding: "utf-8" })
        editor.update(() => $setTextContent(draft))
      } catch (e) {
        setDraftPath("")
        console.error(e)
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }
    ;(async () => {
      setIsFallback(true)
      if (IS_PROD && draftPath) await f()
      setIsFallback(false)
    })()
  }, [draftPath])

  return null
}
