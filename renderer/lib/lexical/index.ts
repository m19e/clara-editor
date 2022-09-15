import { $getRoot, $createParagraphNode, $createTextNode } from "lexical"

export const $setTextContent = (text: string) => {
  const root = $getRoot()
  if (root.getFirstChild()) {
    root.clear()
  }
  text.split("\n").forEach((line) => {
    const paragraph = $createParagraphNode()
    if (line.length !== 0) {
      paragraph.append($createTextNode(line))
    }
    root.append(paragraph)
  })
  root.selectEnd()
}
