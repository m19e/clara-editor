import { useRef, useState, useEffect, useCallback, useMemo } from "react"
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
  useDisplayLineNumber,
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
  const [displayLN] = useDisplayLineNumber()
  const [, setCharCount] = useCharCount()
  const [, setSelectedCharCount] = useSelectedCharCount()

  const editorRef = useRef<HTMLDivElement | null>(null)
  const scrollRef = useRef<HTMLElement | null>(null)

  const [lineCount, setLineCount] = useState(1)

  const updateLineNumCount = useCallback(
    (editorWidth: number) => {
      const lineWidth = 16 * fs * lh
      const count = Math.round(editorWidth / lineWidth)
      setLineCount(count + 2)
    },
    [fs, lh]
  )

  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.setAttribute(
        "style",
        `
        height: ${lw}em;
        max-height: calc(100vh - 8rem - 1rem - 2em - ${fs}rem * ${lh});
        `
      )
    }
  }, [fs, lh, lw])

  useEffect(() => {
    const resizeObs = new ResizeObserver(
      (entries: ReadonlyArray<ResizeObserverEntry>) => {
        const { width } = entries[0].contentRect
        updateLineNumCount(width)
      }
    )
    editorRef.current && displayLN && resizeObs.observe(editorRef.current)

    return () => {
      resizeObs.disconnect()
    }
  }, [editorRef, displayLN, updateLineNumCount])

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
          >
            <div className="flex-1"></div>
            <div
              className={`flex h-full flex-col ${ft}`}
              style={{
                fontSize: `${fs}rem`,
                lineHeight: lh,
              }}
            >
              <LineNumber count={lineCount} />
              <div className="vertical relative my-[1em]" ref={editorRef}>
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
            <div className="flex-1"></div>
          </Scrollbar>
        </div>
      </div>
      <Footer />
    </LexicalComposer>
  )
}

const LineNumber: FC<{ count: number }> = ({ count }) => {
  const [fs] = useFontSize()
  const [lh] = useLineHeight()
  const [display] = useDisplayLineNumber()

  const labels = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => {
        const num = i + 1
        const isBullet = !(num === 1 || num % 5 === 0)
        return isBullet ? "・" : String(num)
      }),
    [count]
  )
  const opacity = display ? "opacity-50" : "opacity-0"

  return (
    <div
      className="relative overflow-x-hidden"
      style={{ height: `calc(${fs}rem * ${lh})` }}
    >
      <div
        className={`absolute top-0 right-0 flex select-none flex-row-reverse transition-opacity ${opacity}`}
      >
        {labels.map((label, i) => (
          <span
            key={i}
            className="w-full text-center"
            style={{
              width: `calc(${fs}rem * ${lh})`,
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
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
