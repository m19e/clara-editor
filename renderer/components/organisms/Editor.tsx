import { useRef, useState, useEffect } from "react"
import type { ComponentProps, FC, WheelEvent } from "react"
import { useTheme } from "next-themes"

import { Drawer, Navbar } from "react-daisyui"

import { $getRoot } from "lexical"

import { useFontSize, useLineHeight, useLineWords } from "@/hooks"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"

import { VerticalPlugin } from "@/plugins/VerticalPlugin"
import { AutoHorizontalScrollPlugin } from "@/plugins/AutoHorizontalScrollPlugin"
import { Setting } from "@/components/organisms/Setting"
import { Footer } from "@/components/organisms/Footer"

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "ClaraEditor",
  onError: (error) => console.error(error),
}

export const Editor: FC = () => {
  const [fs] = useFontSize()
  const [lh] = useLineHeight()
  const [lw] = useLineWords()
  const { theme, setTheme } = useTheme()

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.setAttribute(
        "style",
        `font-size: ${fs}rem; line-height: ${lh}; max-height: calc(${lw}em + 7rem);`
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
      <Drawer
        side={<Setting />}
        open={isDrawerOpen}
        onClickOverlay={() => setIsDrawerOpen(false)}
      >
        <div className="h-full w-full">
          <div id="container" className="grid h-full w-full place-items-center">
            <div className="flex w-3/4 justify-center">
              <div
                className="scrollbar vertical relative h-full overflow-x-auto overflow-y-hidden py-14"
                ref={containerRef}
                onWheel={handleWheel}
              >
                <PlainTextPlugin
                  contentEditable={
                    <ContentEditable className="font-serif focus:outline-none" />
                  }
                  placeholder={<Placeholder />}
                />
              </div>
            </div>
          </div>
        </div>
      </Drawer>

      <div className="fixed top-0 w-full">
        <Navbar className="min-h-[3rem] gap-2 opacity-0 shadow transition-opacity duration-1000 ease-out hover:opacity-100">
          <div className="flex flex-1 justify-start gap-2">
            <div className="btn btn-xs" onClick={() => setIsDrawerOpen(true)}>
              open setting
            </div>
          </div>
          <div className="flex flex-1 justify-center text-sm">
            <div
              className="btn btn-xs"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              toggle theme: {theme}
            </div>
          </div>
          <div className="flex flex-1 justify-end"></div>
        </Navbar>
      </div>
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
    <div className="pointer-events-none absolute top-14 right-0 select-none  font-serif text-gray-500">
      執筆を始める
    </div>
  )
}
