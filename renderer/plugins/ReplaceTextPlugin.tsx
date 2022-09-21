import { useEffect } from "react"
import {
  $getSelection,
  $isRangeSelection,
  PASTE_COMMAND,
  COMMAND_PRIORITY_LOW,
  TextNode,
} from "lexical"
import type { RangeSelection, GridSelection } from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

export const ReplaceTextPlugin = () => {
  const [editor] = useLexicalComposerContext()

  const registerPaste = editor.registerCommand(
    PASTE_COMMAND,
    (event) => {
      const selection = $getSelection()
      if (!$isRangeSelection(selection)) {
        return false
      }
      event.preventDefault()
      editor.update(
        () => {
          const clipboardData =
            event instanceof InputEvent || event instanceof KeyboardEvent
              ? null
              : event.clipboardData

          if (clipboardData != null) {
            $insertDataTransferForPlainText(clipboardData, selection)
          }
        },
        {
          tag: "paste",
        }
      )
      return true
    },
    COMMAND_PRIORITY_LOW
  )

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (node: TextNode) => {
      const text = node.getTextContent()
      if (shouldReplaceText(text)) {
        node.setTextContent(replacer(text))
      }
    })
  }, [editor])

  return null
}

// eslint-disable-next-line no-useless-escape
const reg = new RegExp(`[\(\)]`, "u")

const shouldReplaceText = (text: string): boolean => !!text.match(reg)

const replacerPairList: { target: RegExp; replace: string }[] = [
  { target: /\(/g, replace: "（" },
  { target: /\)/g, replace: "）" },
]

const replacer = (initialText: string) =>
  replacerPairList.reduce(
    (prevText, pair) => prevText.replace(pair.target, pair.replace),
    initialText
  )

const $insertDataTransferForPlainText = (
  dataTransfer: DataTransfer,
  selection: RangeSelection | GridSelection
): void => {
  const text = dataTransfer.getData("text/plain")

  if (text === null) return
  if (shouldReplaceText(text)) {
    const replaced = replacer(text)
    selection.insertRawText(replaced)
  } else {
    selection.insertRawText(text)
  }
}
