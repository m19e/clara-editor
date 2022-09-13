import type { FC } from "react"
import { useEffect } from "react"

import {
  $getSelection,
  $isRangeSelection,
  KEY_MODIFIER_COMMAND,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ARROW_LEFT_COMMAND,
  KEY_ARROW_RIGHT_COMMAND,
  COMMAND_PRIORITY_LOW,
  COMMAND_PRIORITY_EDITOR,
} from "lexical"
import { mergeRegister } from "@lexical/utils"
import { $moveCharacter } from "@lexical/selection"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

import { $moveWord, $moveLine } from "@/lib/selection"

export const VerticalPlugin: FC = () => {
  const [editor] = useLexicalComposerContext()

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<KeyboardEvent>(
        KEY_MODIFIER_COMMAND,
        (event) => {
          if (event.ctrlKey) {
            if (event.keyCode === 37) {
              return editor.dispatchCommand(KEY_ARROW_LEFT_COMMAND, event)
            }
            if (event.keyCode === 39) {
              return editor.dispatchCommand(KEY_ARROW_RIGHT_COMMAND, event)
            }
            if (event.keyCode === 40) {
              return editor.dispatchCommand(KEY_ARROW_DOWN_COMMAND, event)
            }
            if (event.keyCode === 38) {
              return editor.dispatchCommand(KEY_ARROW_UP_COMMAND, event)
            }
          }
          return false
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_LEFT_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) {
            return false
          }
          const isHoldingShift = payload.shiftKey
          // if we prevent default, cannot autoscroll following caret on Chrome & Webkit
          payload.preventDefault()
          $moveLine(selection, isHoldingShift, false)
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_RIGHT_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) {
            return false
          }
          const isHoldingShift = payload.shiftKey
          // if we prevent default, cannot autoscroll following caret on Chrome & Webkit
          payload.preventDefault()
          $moveLine(selection, isHoldingShift, true)
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_DOWN_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) {
            return false
          }
          const isHoldingShift = payload.shiftKey
          payload.preventDefault()
          if (payload.ctrlKey) {
            $moveWord(selection, isHoldingShift, false)
          } else {
            $moveCharacter(selection, isHoldingShift, false)
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand<KeyboardEvent>(
        KEY_ARROW_UP_COMMAND,
        (payload) => {
          const selection = $getSelection()
          if (!$isRangeSelection(selection)) {
            return false
          }
          const isHoldingShift = payload.shiftKey
          payload.preventDefault()
          if (payload.ctrlKey) {
            $moveWord(selection, isHoldingShift, true)
          } else {
            $moveCharacter(selection, isHoldingShift, true)
          }
          return true
        },
        COMMAND_PRIORITY_EDITOR
      )
    )
  }, [editor])

  return null
}
