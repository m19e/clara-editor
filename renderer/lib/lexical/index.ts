import { $getRoot, $createParagraphNode } from "lexical"

export const $setTextContent = (text: string) => {
  const root = $getRoot()
  if (root.getFirstChild()) {
    root.clear()
  }
  const paragraph = $createParagraphNode()
  root.append(paragraph)
  const selection = root.selectStart()
  selection.insertRawText(text)
  root.selectEnd()
}
