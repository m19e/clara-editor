import type { ComponentProps, FC } from "react"

import { LexicalComposer } from "@lexical/react/LexicalComposer"

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "ClaraEditor",
  onError: (error) => console.error(error),
}

export const Editor: FC = () => {
  return null
}
