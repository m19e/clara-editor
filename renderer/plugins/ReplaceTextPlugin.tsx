import { useEffect } from "react"
import {
  $getSelection,
  $isRangeSelection,
  $createTextNode,
  PASTE_COMMAND,
  COMMAND_PRIORITY_LOW,
} from "lexical"
import { mergeRegister } from "@lexical/utils"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

export const ReplaceTextPlugin = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        editor.update(() => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) return

          const selectedNodes = selection.getNodes()
          const joinedText = selectedNodes
            .map((n) => n.getTextContent())
            .join("")

          if (!shouldReplaceText(joinedText)) return
          selectedNodes
            .filter((n) => shouldReplaceText(n.getTextContent()))
            .forEach((node) => {
              const nodeText = node.getTextContent()
              const newNode = $createTextNode(replacer(nodeText))
              node.replace(newNode)
            })
        })
      }),
      editor.registerCommand(
        PASTE_COMMAND,
        (event) => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) {
            return false
          }

          event.preventDefault()
          editor.update(
            () => {
              const selection = $getSelection()
              const clipboardData =
                event instanceof InputEvent || event instanceof KeyboardEvent
                  ? null
                  : event.clipboardData

              if (clipboardData != null) {
                const text = clipboardData.getData("text/plain")

                if (text === null) return
                if (shouldReplaceText(text)) {
                  const replaced = replacer(text)
                  selection.insertRawText(replaced)
                } else {
                  selection.insertRawText(text)
                }
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
    )
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
