import { useRef, useEffect } from "react"
import type { ComponentProps, FC, WheelEvent } from "react"

import { Drawer } from "react-daisyui"

import { LexicalComposer } from "@lexical/react/LexicalComposer"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin"

import { VerticalPlugin } from "@/plugins/VerticalPlugin"
import { AutoHorizontalScrollPlugin } from "@/plugins/AutoHorizontalScrollPlugin"

const initialConfig: ComponentProps<typeof LexicalComposer>["initialConfig"] = {
  namespace: "ClaraEditor",
  onError: (error) => console.error(error),
}

export const Editor: FC = () => {
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
        side={
          <div className="prose bg-base-100 text-base-content flex h-full w-80 flex-col gap-4 overflow-y-auto p-4">
            drawer open!
          </div>
        }
        open={false}
      >
        <div className="h-full w-full">
          <div
            id="container"
            className="flex h-full w-full flex-col items-center justify-center"
          >
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
          </div>
        </div>
      </Drawer>
      <AutoFocusPlugin defaultSelection="rootEnd" />
      <AutoHorizontalScrollPlugin scrollRef={containerRef} />
      <HistoryPlugin />
      <VerticalPlugin />
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
