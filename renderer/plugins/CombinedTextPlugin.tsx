import { useEffect, useCallback } from "react"
import { TextNode } from "lexical"
import {
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread,
  LexicalEditor,
  $createTextNode,
} from "lexical"
import { useLexicalTextEntity } from "@lexical/react/useLexicalTextEntity"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"

export type SerializedCombinedNode = Spread<
  {
    className: string
    type: "combined"
  },
  SerializedTextNode
>

export class CombinedNode extends TextNode {
  __className: string

  static getType(): string {
    return "combined"
  }

  static clone(node: CombinedNode): CombinedNode {
    return new CombinedNode(node.__text, node.__key)
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key)
    this.__className = "text-combined"
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config)
    dom.className = this.__className
    return dom
  }

  static importJSON(serializedNode: SerializedCombinedNode): CombinedNode {
    const node = $createCombinedNode(serializedNode.text)
    node.setFormat(serializedNode.format)
    node.setDetail(serializedNode.detail)
    node.setMode(serializedNode.mode)
    node.setStyle(serializedNode.style)
    return node
  }

  exportJSON(): SerializedCombinedNode {
    return {
      ...super.exportJSON(),
      className: this.getClassName(),
      type: "combined",
    }
  }

  getClassName(): string {
    const self = this.getLatest()
    return self.__className
  }
}

export function $isCombinedNode(
  node: LexicalNode | null | undefined
): node is CombinedNode {
  return node instanceof CombinedNode
}

export function $createCombinedNode(combinedText: string): CombinedNode {
  return new CombinedNode(combinedText).setMode("token")
}

const combineds: Map<string, [string, string]> = new Map([
  [":)", ["combined happysmile", "🙂"]],
  [":D", ["combined veryhappysmile", "😀"]],
  [":(", ["combined unhappysmile", "🙁"]],
  ["<3", ["combined heart", "❤"]],
  ["🙂", ["combined hqappysmile", "🙂"]],
  ["😀", ["combined veryhappysmile", "😀"]],
  ["🙁", ["combined unhappysmile", "🙁"]],
  ["❤", ["combined heart", "❤"]],
])

function findAndTransformCombined(node: TextNode): null | TextNode {
  const text = node.getTextContent()

  const isStartNum = text.match(/^\d/)
  const prevNode = node.getPreviousSibling()
  if (
    isStartNum &&
    prevNode &&
    $isCombinedNode(prevNode) &&
    prevNode.getTextContent().length === 2
  ) {
    const [num] = text.split("")
    prevNode.replace($createCombinedNode(prevNode.getTextContent() + num))

    node.replace($createTextNode(text.substring(1))).select(0, 0)
    return node
  }

  const matchArr = /\d{2,3}/.exec(text)
  if (matchArr === null) {
    return null
  }

  const matchText = matchArr[0]

  const combinedLength = matchText.length
  const startOffset = matchArr.index
  const endOffset = startOffset + combinedLength

  let targetNode: null | TextNode = null

  if (matchArr.index === 0) {
    ;[targetNode] = node.splitText(endOffset)
  } else {
    ;[, targetNode] = node.splitText(startOffset, endOffset)
  }

  const combinedNode = $createCombinedNode(matchText)
  targetNode.replace(combinedNode)
  return combinedNode

  return null
}

function textNodeTransform(node: TextNode): void {
  let targetNode: TextNode | null = node

  while (targetNode !== null) {
    if (!targetNode.isSimpleText()) {
      return
    }

    targetNode = findAndTransformCombined(targetNode)
  }
}

function useCombined(editor: LexicalEditor): void {
  useEffect(() => {
    if (!editor.hasNodes([CombinedNode])) {
      throw new Error("CombinedPlugin: CombinedNode not registered on editor")
    }

    return editor.registerNodeTransform(TextNode, textNodeTransform)
  }, [editor])
}

const useCombinedText = (editor: LexicalEditor) => {
  useEffect(() => {
    if (!editor.hasNodes([CombinedNode])) {
      throw new Error("CombinedPlugin: CombinedNode not registered on editor")
    }
  }, [editor])

  const createCombinedNode = useCallback((textNode: TextNode): CombinedNode => {
    return $createCombinedNode(textNode.getTextContent())
  }, [])

  const getCombinedMatch = useCallback((text: string) => {
    const matchArr = /[0-9]{2,3}/.exec(text)
    console.log(text, matchArr)

    if (matchArr === null) {
      return null
    }

    const combinedLength = matchArr[0].length
    const startOffset = matchArr.index
    const endOffset = startOffset + combinedLength

    return {
      end: endOffset,
      start: startOffset,
    }
  }, [])

  useLexicalTextEntity<CombinedNode>(
    getCombinedMatch,
    CombinedNode,
    createCombinedNode
  )
}

export default function CombinedPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext()
  useCombined(editor)
  return null
}
