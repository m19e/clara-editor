import { useRef, useEffect } from "react"
import type { ComponentProps, FC, WheelEvent } from "react"
import { $getRoot } from "lexical"

import { useFontType, useFontSize, useLineHeight, useLineWords } from "@/hooks"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"

import { VerticalPlugin } from "@/plugins/VerticalPlugin"
import { AutoHorizontalScrollPlugin } from "@/plugins/AutoHorizontalScrollPlugin"
import { Header } from "@/components/organisms/Header"
import { Footer } from "@/components/organisms/Footer"

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "ClaraEditor",
  onError: (error) => console.error(error),
}

export const Editor: FC = () => {
  const [ft] = useFontType()
  const [fs] = useFontSize()
  const [lh] = useLineHeight()
  const [lw] = useLineWords()

  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute(
        "style",
        `font-size: ${fs}rem; line-height: ${lh}; height: calc(${lw}em + 1em); max-height: calc(100vh - 8rem - 1em);`
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

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="h-screen w-full">
        <div
          id="container"
          className="flex h-full w-full flex-col items-center justify-center"
        >
          <div className="flex w-3/4 justify-center">
            <div
              className={
                "scrollbar vertical relative overflow-x-auto overflow-y-hidden " +
                ft
              }
              ref={containerRef}
              onWheel={handleWheel}
            >
              <PlainTextPlugin
                contentEditable={
                  <ContentEditable className="text-base-content focus:outline-none" />
                }
                placeholder={<Placeholder />}
              />
            </div>
          </div>
        </div>
      </div>

      <Header />
      <Footer />

      <AutoFocusPlugin defaultSelection="rootEnd" />
      <AutoHorizontalScrollPlugin scrollRef={containerRef} />
      <HistoryPlugin />
      <VerticalPlugin />
      <OnChangePlugin
        onChange={(state) =>
          console.log(
            state.read(
              () => $getRoot().getTextContent().replace(/\n/g, "").length
            )
          )
        }
        ignoreInitialChange
        ignoreSelectionChange
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
