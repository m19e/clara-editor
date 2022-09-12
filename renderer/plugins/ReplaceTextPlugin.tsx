import { useEffect } from "react"
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $createTextNode,
} from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

export const ReplaceTextPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.update(() => {
        const selection = $getSelection()
        if (!$isRangeSelection(selection)) return

        const root = $getRoot()
        const rootText = root.getTextContent()
        if (!rootText.includes("(") && !rootText.includes(")")) return
        root
          .getAllTextNodes()
          .filter((node) => {
            const t = node.getTextContent()
            return t.includes("(") || t.includes(")")
          })
          .forEach((node) => {
            const nodeText = node.getTextContent()
            const newNode = $createTextNode(
              nodeText.replace(/\(/g, "（").replace(/\)/g, "）")
            )
            node.replace(newNode)
          })
      })
    })
  }, [editor])

  return null
}
