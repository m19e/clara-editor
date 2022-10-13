import {
  TextNode,
  EditorConfig,
  LexicalNode,
  LexicalEditor,
  NodeKey,
  $createTextNode,
} from "lexical"
import { mergeRegister } from "@lexical/utils"

export class CombinedNumberNode extends TextNode {
  constructor(text: string, key?: NodeKey) {
    super(text, key)
  }

  static getType(): string {
    return "combine"
  }
  static clone(node: CombinedNumberNode): CombinedNumberNode {
    return new CombinedNumberNode(node.__text, node.__key)
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config)
    element.style.textCombineUpright = "all"
    return element
  }
  updateDOM(
    prevNode: CombinedNumberNode,
    dom: HTMLElement,
    config: EditorConfig
  ): boolean {
    const isUpdated = super.updateDOM(prevNode, dom, config)
    if (prevNode.__combine !== this.__combine) {
      dom.style.textCombineUpright = "all"
    }
    return isUpdated
  }
}

export function $createCombinedNumberNode(text: string): CombinedNumberNode {
  return new CombinedNumberNode(text)
}

export function $isCombinedNumberNode(
  node: LexicalNode
): node is CombinedNumberNode {
  return node instanceof CombinedNumberNode
}

export function registerTransformAnyColoredText(
  editor: LexicalEditor
): () => void {
  return mergeRegister(
    editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
      const text = textNode.getTextContent()
      const matched = /color:(.*)/.exec(text)
      if (matched !== null) {
        const color = matched[1]
        if (isValidColor(color)) {
          textNode.replace($createCombinedNumberNode(text))
        }
      }
    }),
    editor.registerNodeTransform(
      CombinedNumberNode,
      (node: CombinedNumberNode) => {
        const text = node.getTextContent()
        const matched = /color:(.*)/.exec(text)
        if (matched === null) {
          node.replace($createTextNode(text))
        } else {
          const color = matched[1]
          const currentColor = node.getColor()
          if (color !== currentColor && isValidColor(color)) {
            node.setColor(color)
          }
        }
      }
    )
  )
}

// https://stackoverflow.com/questions/48484767/javascript-check-if-string-is-valid-css-color
const isValidColor = (strColor: string) => {
  const s = new Option().style
  s.color = strColor
  return s.color !== ""
}
