import { useState } from "react"
import { Form, Toggle, Range } from "react-daisyui"

export const Setting = () => {
  const [isLineNumOn, setIsLineNumOn] = useState(true)
  const [isLenCountOn, setIsLenCountOn] = useState(true)
  const [colorMode, setColorMode] = useState<"dark" | "light">("dark")

  const [lineWords, setLineWords] = useState(20)
  const [lineHeight, setLineHeight] = useState(2)
  const [fontSize, setFontSize] = useState(1)

  return (
    <div className="prose bg-base-100 text-base-content flex h-full w-80 flex-col gap-4 overflow-y-auto p-4">
      <div className="bg-base-200 flex flex-col gap-2 rounded p-2 shadow">
        <Form>
          <Form.Label title="行番号を表示" className="cursor-pointer">
            <Toggle
              size="sm"
              checked={isLineNumOn}
              onChange={() => setIsLineNumOn((prev) => !prev)}
            />
          </Form.Label>
        </Form>
        <Form>
          <Form.Label title="文字数を表示" className="cursor-pointer">
            <Toggle
              size="sm"
              checked={isLenCountOn}
              onChange={() => setIsLenCountOn(!isLenCountOn)}
            />
          </Form.Label>
        </Form>
        <Form>
          <Form.Label title="ダークモード" className="cursor-pointer">
            <Toggle
              size="sm"
              checked={colorMode === "dark"}
              onChange={() =>
                setColorMode((prev) => (prev === "dark" ? "light" : "dark"))
              }
            />
          </Form.Label>
        </Form>
      </div>
      <div className="bg-base-200 flex flex-col gap-3 rounded p-4 shadow">
        <label className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm">行文字数</span>
          </div>
          <div className=" tooltip tooltip-open" data-tip={lineWords}>
            <Range
              min={25}
              max={50}
              type="range"
              value={lineWords}
              size="xs"
              onChange={(e) => setLineWords(parseInt(e.target.value))}
            />
          </div>
        </label>
        <label className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm">行間</span>
          </div>
          <div className=" tooltip tooltip-open" data-tip={lineHeight}>
            <Range
              min={15}
              max={25}
              type="range"
              value={lineHeight * 10}
              size="xs"
              onChange={(e) => setLineHeight(Number(e.target.value) / 10)}
            />
          </div>
        </label>
        <label className="flex flex-col gap-2">
          <div className="flex justify-between">
            <span className="text-sm">文字サイズ</span>
          </div>
          <div className=" tooltip tooltip-open" data-tip={fontSize}>
            <Range
              min={5}
              max={15}
              type="range"
              value={fontSize * 10}
              size="xs"
              onChange={(e) => setFontSize(Number(e.target.value) / 10)}
            />
          </div>
        </label>
      </div>
    </div>
  )
}
