/* eslint-disable no-useless-escape */
import { useEffect } from "react"
import {
  $getSelection,
  $isRangeSelection,
  PASTE_COMMAND,
  INSERT_LINE_BREAK_COMMAND,
  COMMAND_PRIORITY_LOW,
  TextNode,
} from "lexical"
import { mergeRegister } from "@lexical/utils"
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
    return mergeRegister(
      editor.registerNodeTransform(TextNode, (node: TextNode) => {
        const text = node.getTextContent()
        if (shouldReplaceText(text)) {
          node.setTextContent(replacer(text))
        }
      }),
      editor.registerCommand(
        INSERT_LINE_BREAK_COMMAND,
        (selectStart) => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) {
            return false
          }
          selection.insertLineBreak(selectStart)
          selection.insertRawText("　")
          return true
        },
        COMMAND_PRIORITY_LOW
      )
    )
  }, [editor])

  return null
}

const replacerPairList: {
  target: {
    reg: RegExp
    text: string
  }
  replace: string
}[] = [
  { target: { reg: /\(/g, text: "(" }, replace: "（" },
  { target: { reg: /\)/g, text: ")" }, replace: "）" },
]

const escapeRegExp = (string: string) => {
  return ("" + string).replace(/[.*+?^=!:${}()|[\]\/\\]/g, "\\$&")
}

const reg = new RegExp(
  String.raw`[${escapeRegExp(
    replacerPairList.map((p) => p.target.text).join("")
  )}]`,
  "u"
)

const shouldReplaceText = (text: string): boolean => !!text.match(reg)

const replacer = (initialText: string) =>
  replacerPairList.reduce(
    (prevText, pair) => prevText.replace(pair.target.reg, pair.replace),
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
