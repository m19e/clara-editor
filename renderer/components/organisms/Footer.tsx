/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
import type { FC } from "react"
import { useMemo } from "react"

import { useFontSize, useLineHeight, useLineWords } from "@/hooks"

export const Footer: FC = () => {
  return (
    <div className="fixed bottom-0 w-full">
      <div className="group border-t-base-300 relative h-[4rem] gap-2 border-t-2 bg-gray-300 p-0">
        <Control />
      </div>
    </div>
  )
}

interface ControlType {
  id: string
  label: string
  inc: () => void
  dec: () => void
  disabled: { inc: boolean; dec: boolean }
}

const Control: FC = () => {
  const [fs, fsAction] = useFontSize()
  const [lh, lhAction] = useLineHeight()
  const [lw, lwAction] = useLineWords()

  const controlList = useMemo<ControlType[]>(() => {
    const dfs = Math.ceil(fs * 10)
    const dlh = Math.ceil(lh * 10)

    return [
      {
        id: "font-size",
        label: `大きさ ${dfs}`,
        inc: fsAction.increment,
        dec: fsAction.decrement,
        disabled: {
          inc: dfs >= 25,
          dec: dfs <= 5,
        },
      },
      {
        id: "line-height",
        label: `行間 ${dlh}`,
        inc: lhAction.increment,
        dec: lhAction.decrement,
        disabled: {
          inc: dlh >= 25,
          dec: dlh <= 15,
        },
      },
      {
        id: "line-words",
        label: `字数 ${lw}`,
        inc: lwAction.increment,
        dec: lwAction.decrement,
        disabled: {
          inc: lw >= 40,
          dec: lw <= 20,
        },
      },
    ]
  }, [fs, lh, lw])

  return (
    <div
      className={`-bottom-[6.5rem absolute -bottom-0 flex w-full justify-center delay-500 duration-150 hover:!bottom-0 group-hover:-bottom-[calc(6.5rem-1rem)]`}
    >
      <div
        className={`bg-base-100 flex h-[6.5rem] w-full flex-col items-center shadow`}
      >
        <div className="flex h-[1rem] w-1/12 items-center justify-center">
          <span className="h-1 w-full rounded bg-gray-400"></span>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="flex items-center gap-4">
            {controlList.map((control) => (
              <div
                key={control.id}
                className="nested-group flex flex-col items-center"
              >
                <ChevronButton
                  type="inc"
                  onClick={control.inc}
                  disabled={control.disabled.inc}
                />
                <span>{control.label}</span>
                <ChevronButton
                  type="dec"
                  onClick={control.dec}
                  disabled={control.disabled.dec}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface ButtonProps {
  type: "inc" | "dec"
  onClick: () => void
  disabled: boolean
}

const ChevronButton: FC<ButtonProps> = ({ type, onClick, disabled }) => {
  const isUp = type === "inc"

  return (
    <button
      className="btn btn-xs btn-ghost no-animation w-full !bg-opacity-0 text-gray-400 transition-none hover:text-gray-600 active:text-gray-800"
      onClick={onClick}
      disabled={disabled}
    >
      <span className="ng-hover:opacity-100 h-5 w-5 opacity-0 transition-opacity">
        <ChevronIcon isUp={isUp} />
      </span>
    </button>
  )
}

interface IconProps {
  isUp: boolean
}

const ChevronIcon: FC<IconProps> = ({ isUp }) => {
  const d = isUp ? "M4.5 15.75l7.5-7.5 7.5 7.5" : "M19.5 8.25l-7.5 7.5-7.5-7.5"

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="h-full w-full"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  )
}
