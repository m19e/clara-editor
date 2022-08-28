import { useRef, useState, useEffect } from "react"
import type { ComponentProps, FC, WheelEvent } from "react"

import { Drawer, Navbar } from "react-daisyui"

import { $getRoot } from "lexical"
import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"

import { VerticalPlugin } from "@/plugins/VerticalPlugin"
import { AutoHorizontalScrollPlugin } from "@/plugins/AutoHorizontalScrollPlugin"
import { Setting } from "@/components/organisms/Setting"

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "ClaraEditor",
  onError: (error) => console.error(error),
}

export const Editor: FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (containerRef.current) {
      // containerRef.current.setAttribute(
      //   "style",
      //   `
      //   height: calc(${lw}em + 7rem);
      //   line-height: ${lineHeight};
      //   font-size: ${fontSize}rem;
      //   `
      // )
    }
  }, [])

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
          <div
            id="container"
            className="flex h-full w-full flex-col items-center justify-between overflow-y-hidden"
          >
            <Navbar className="border-b-base-300 min-h-[3rem] gap-2 border-b-2 opacity-0 transition-opacity duration-1000 ease-out hover:opacity-100">
              <div className="flex flex-1 justify-start gap-2">
                <div
                  className="btn btn-xs"
                  onClick={() => setIsDrawerOpen(true)}
                >
                  open setting
                </div>
              </div>
              <div className="flex flex-1 justify-center text-sm"></div>
              <div className="flex flex-1 justify-end"></div>
            </Navbar>
            <div className="flex w-3/4 justify-center">
              <div
                className="scrollbar vertical relative overflow-x-auto overflow-y-hidden py-14"
                ref={containerRef}
                onWheel={handleWheel}
                style={{
                  height: "calc(20em + 7em)",
                  lineHeight: "1.5",
                  fontSize: "1.25rem",
                }}
              >
                <PlainTextPlugin
                  contentEditable={
                    <ContentEditable className="h-full font-serif focus:outline-none" />
                  }
                  placeholder={<Placeholder />}
                />
              </div>
            </div>
            <Navbar className="border-t-base-300 group relative min-h-[3rem] gap-2 overflow-visible border-t-2 bg-gray-300">
              <div className="absolute top-24 z-10 duration-200 group-hover:-top-24">
                <span className="">title</span>
                <span className="">info</span>
              </div>
            </Navbar>
          </div>
        </div>
      </Drawer>
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
