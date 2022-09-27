import { useEffect } from "react"
import { TextNode } from "lexical"
import type {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
  LexicalEditor,
} from "lexical"

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

export type SerializedEmojiNode = Spread<
  {
    className: string
    type: "emoji"
  },
  SerializedTextNode
>

export class EmojiNode extends TextNode {
  __className: string

  static getType(): string {
    return "emoji"
  }

  static clone(node: EmojiNode): EmojiNode {
    return new EmojiNode(node.__className, node.__text, node.__key)
  }

  constructor(className: string, text: string, key?: NodeKey) {
    super(text, key)
    this.__className = className
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = document.createElement("span")
    const inner = super.createDOM(config)
    dom.className = this.__className
    inner.className = "emoji-inner"
    dom.appendChild(inner)
    return dom
  }

  updateDOM(
    prevNode: TextNode,
    dom: HTMLElement,
    config: EditorConfig
  ): boolean {
    const inner = dom.firstChild
    if (inner === null) {
      return true
    }
    super.updateDOM(prevNode, inner as HTMLElement, config)
    return false
  }

  static importJSON(serializedNode: SerializedEmojiNode): EmojiNode {
    const node = $createEmojiNode(serializedNode.className, serializedNode.text)
    node.setFormat(serializedNode.format)
    node.setDetail(serializedNode.detail)
    node.setMode(serializedNode.mode)
    node.setStyle(serializedNode.style)
    return node
  }

  exportJSON(): SerializedEmojiNode {
    return {
      ...super.exportJSON(),
      className: this.getClassName(),
      type: "emoji",
    }
  }

  getClassName(): string {
    const self = this.getLatest()
    return self.__className
  }
}

export function $isEmojiNode(
  node: LexicalNode | null | undefined
): node is EmojiNode {
  return node instanceof EmojiNode
}

export function $createEmojiNode(
  className: string,
  emojiText: string
): EmojiNode {
  return new EmojiNode(className, emojiText).setMode("token")
}

const emojis: Map<string, [string, string]> = new Map([
  [":)", ["emoji happysmile", "🙂"]],
  [":D", ["emoji veryhappysmile", "😀"]],
  [":(", ["emoji unhappysmile", "🙁"]],
  ["<3", ["emoji heart", "❤"]],
  ["🙂", ["emoji happysmile", "🙂"]],
  ["😀", ["emoji veryhappysmile", "😀"]],
  ["🙁", ["emoji unhappysmile", "🙁"]],
  ["❤", ["emoji heart", "❤"]],
])

function findAndTransformEmoji(node: TextNode): null | TextNode {
  const text = node.getTextContent()

  for (let i = 0; i < text.length; i++) {
    const emojiData = emojis.get(text[i]) || emojis.get(text.slice(i, i + 2))

    if (emojiData !== undefined) {
      const [emojiStyle, emojiText] = emojiData
      let targetNode

      if (i === 0) {
        ;[targetNode] = node.splitText(i + 2)
      } else {
        ;[, targetNode] = node.splitText(i, i + 2)
      }

      const emojiNode = $createEmojiNode(emojiStyle, emojiText)
      targetNode.replace(emojiNode)
      return emojiNode
    }
  }

  return null
}

function textNodeTransform(node: TextNode): void {
  let targetNode: TextNode | null = node

  while (targetNode !== null) {
    if (!targetNode.isSimpleText()) {
      return
    }

    targetNode = findAndTransformEmoji(targetNode)
  }
}

function useEmojis(editor: LexicalEditor): void {
  useEffect(() => {
    if (!editor.hasNodes([EmojiNode])) {
      throw new Error("EmojisPlugin: EmojiNode not registered on editor")
    }

    return editor.registerNodeTransform(TextNode, textNodeTransform)
  }, [editor])
}

export default function EmojisPlugin(): null {
  const [editor] = useLexicalComposerContext()
  useEmojis(editor)
  return null
}
