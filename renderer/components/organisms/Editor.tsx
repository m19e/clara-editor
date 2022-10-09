import { useRef, useState, useEffect } from "react"
import type { ComponentProps, FC, WheelEvent } from "react"
import { $getRoot, $getSelection, $isRangeSelection } from "lexical"
import type { EditorState } from "lexical"
import Scrollbar from "react-perfect-scrollbar"
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
import { IpcListener } from "@/foundations/IpcListener"
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

  const editorRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLElement | null>(null)

  const [lineNumCount, setLineNumCount] = useState(3)

  const updateLineNumCount = () => {
    if (!editorRef.current) return
    const rect = editorRef.current.getBoundingClientRect()
    const lineWidth = 16 * fs * lh
    const count = Math.trunc(rect.width / lineWidth)
    setLineNumCount(count + 3)
  }

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setAttribute(
        "style",
        `
        font-size: ${fs}rem;
        line-height: ${lh};
        height: ${lw}em;
        max-height: calc(100vh - 8rem - 1rem - 2em);
        `
      )
    }
    updateLineNumCount()
  }, [fs, lh, lw])

  const handleWheel = (e: WheelEvent<HTMLElement>) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
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
    updateLineNumCount()
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <MetaHead />
      <IpcListener />
      <AutoLoadPlugin />
      <AutoSavePlugin />
      <AutoFocusPlugin defaultSelection="rootEnd" />
      <AutoHorizontalScrollPlugin scrollRef={scrollRef} />
      <HistoryPlugin />
      <VerticalPlugin />
      <ReplaceTextPlugin />
      <OnChangePlugin
        onChange={handleEditorChange}
        ignoreInitialChange={true}
      />

      {isFallback && <Fallback />}
      <div className="flex h-screen items-center justify-center">
        <div className="w-3/4">
          <Scrollbar
            className="flex pb-4"
            containerRef={(ref) => (scrollRef.current = ref)}
            onWheel={handleWheel}
            style={{ paddingTop: `${fs * 2}rem` }}
          >
            <div className="flex-1"></div>
            <div className={`vertical relative ${ft}`} ref={editorRef}>
              <div className="absolute -top-[2em] right-0 flex w-full flex-col overflow-hidden">
                {Array.from({ length: lineNumCount }).map((_, i) => {
                  const num = i + 1
                  const isBullet = !(num === 1 || num % 5 === 0)

                  if (isBullet) {
                    return <span key={i}>・</span>
                  }
                  return (
                    <div key={i} className="relative">
                      <span className="opacity-0">・</span>
                      <span
                        className="absolute -top-[0.5em] w-full text-center"
                        style={{
                          writingMode: "horizontal-tb",
                          fontSize: `${fs}rem`,
                        }}
                      >
                        {num}
                      </span>
                    </div>
                  )
                })}
              </div>
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
            <div className="flex-1"></div>
          </Scrollbar>
        </div>
      </div>
      <Footer />
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
