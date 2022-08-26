import type { ComponentProps, FC } from "react"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"

import { VerticalPlugin } from "@/plugins/VerticalPlugin"

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "ClaraEditor",
  onError: (error) => console.error(error),
}

export const Editor: FC = () => {
  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="vertical relative min-h-[240px] p-6">
        <PlainTextPlugin
          contentEditable={
            <ContentEditable className="h-full min-w-full font-serif focus:outline-none" />
          }
          placeholder={<Placeholder />}
        />
      </div>
      <AutoFocusPlugin defaultSelection="rootEnd" />
      <HistoryPlugin />
      <VerticalPlugin />
    </LexicalComposer>
  )
}

const Placeholder: FC = () => {
  return (
    <div className="pointer-events-none absolute top-6 left-6 select-none text-gray-500">
      執筆を始める
    </div>
  )
}
