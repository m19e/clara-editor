import { readFile } from "fs/promises"
import type { FC } from "react"
import { useEffect } from "react"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { $setTextContent } from "@/lib/lexical"
import { useIsFallback, useDraftPath } from "@/hooks"

const isProd = process.env.NODE_ENV === "production"

export const AutoLoadPlugin: FC = () => {
  const [editor] = useLexicalComposerContext()
  const [, setIsFallback] = useIsFallback()
  const [draftPath, setDraftPath] = useDraftPath()

  useEffect(() => {
    const f = async () => {
      setIsFallback(true)
      try {
        const draft = await readFile(draftPath, { encoding: "utf-8" })
        editor.update(() => $setTextContent(draft))
      } catch (e) {
        setDraftPath("")
        console.error(e)
      }
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setIsFallback(false)
    }
    if (isProd && draftPath) f()
  }, [draftPath])

  return null
}
