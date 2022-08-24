import type { ComponentProps, FC } from "react"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "ClaraEditor",
  onError: (error) => console.error(error),
}

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="vertical-editor">
        <PlainTextPlugin
          contentEditable={<ContentEditable className="content-editable" />}
          placeholder={<Placeholder />}
        />
      </div>
    </LexicalComposer>
  )
}

const Placeholder: FC = () => {
  return <div className="placeholder">いまどうしてる？</div>
}
