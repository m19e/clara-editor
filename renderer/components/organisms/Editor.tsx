import { useRef, useEffect } from "react"
import type { ComponentProps, FC, WheelEvent } from "react"
import { $getRoot, $getSelection, $isRangeSelection } from "lexical"
import type { EditorState } from "lexical"
import "react-perfect-scrollbar/dist/css/styles.css"

import {
  useIsFallback,
  useFontType,
  useFontSize,
  useLineHeight,
  useLineWords,
  useCharCount,
  useSelectedCharCount,
} from "@/hooks"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"

import { VerticalPlugin } from "@/plugins/VerticalPlugin"
import { ReplaceTextPlugin } from "@/plugins/ReplaceTextPlugin"
import { AutoLoadPlugin } from "@/plugins/AutoLoadPlugin"
import { AutoSavePlugin } from "@/plugins/AutoSavePlugin"
import { AutoHorizontalScrollPlugin } from "@/plugins/AutoHorizontalScrollPlugin"

import { MetaHead } from "@/foundations/MetaHead"
import { IpcListener } from "@/components/organisms/IpcListener"
import { Footer } from "@/components/organisms/Footer"

const getTextCharCount = (text: string): number => {
  const regex = /(?:\r\n|\r|\n)/g
  const cleanString = text.replace(regex, "").trim()
  return Array.from(cleanString).length
}

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "ClaraEditor",
  onError: (error) => console.error(error),
}

export const Editor: FC = () => {
  const [isFallback] = useIsFallback()
  const [ft] = useFontType()
  const [fs] = useFontSize()
  const [lh] = useLineHeight()
  const [lw] = useLineWords()
  const [, setCharCount] = useCharCount()
  const [, setSelectedCharCount] = useSelectedCharCount()

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute(
        "style",
        `
        font-size: ${fs}rem;
        line-height: ${lh};
        height: calc(${lw}em + 0.5rem + 1em);
        max-height: calc(100vh - 8rem - 0.5rem - 1em);
        `
      )
    }
  }, [fs, lh, lw])

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (containerRef.current) {
      containerRef.current.scrollBy({
        top: 0,
        left: -(e.deltaY * 3),
        behavior: "smooth",
      })
    }
  }
  const handleEditorChange = (state: EditorState) => {
    state.read(() => {
      setCharCount(getTextCharCount($getRoot().getTextContent()))
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        setSelectedCharCount(getTextCharCount(selection.getTextContent()))
      } else {
        setSelectedCharCount(0)
      }
    })
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <MetaHead />
      <IpcListener />
      {isFallback && <Fallback />}
      <div className="h-screen w-full">
        <div
          id="container"
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <div className="flex w-3/4 justify-center">
            <div
              className={`scrollbar vertical relative overflow-x-auto overflow-y-hidden pb-2 ${ft}`}
              ref={containerRef}
              onWheel={handleWheel}
            >
              <PlainTextPlugin
                contentEditable={
                  <ContentEditable
                    className="text-base-content text-upright break-all text-justify focus:outline-none"
                    spellCheck={false}
                  />
                }
                placeholder={<Placeholder />}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer />

      <AutoLoadPlugin />
      <AutoSavePlugin />
      <AutoFocusPlugin defaultSelection="rootEnd" />
      <AutoHorizontalScrollPlugin scrollRef={containerRef} />
      <HistoryPlugin />
      <VerticalPlugin />
      <ReplaceTextPlugin />
      <OnChangePlugin
        onChange={handleEditorChange}
        ignoreInitialChange={true}
      />
    </LexicalComposer>
  )
}

const Placeholder: FC = () => {
  return (
    <div className="text-base-content pointer-events-none absolute top-0 right-0 select-none text-opacity-60">
      執筆を始める
    </div>
  )
}

const Fallback = () => {
  return (
    <div className="bg-base-100 fixed top-0 z-50 flex h-screen w-screen items-center justify-center">
      <div className="border-base-content h-10 w-10 animate-spin rounded-full border-4 border-t-transparent"></div>
    </div>
  )
}
