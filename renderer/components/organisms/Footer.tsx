/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
import { FC } from "react"

export const Footer: FC = () => {
  return (
    <div className="fixed bottom-0 w-full">
      <div className="group border-t-base-300 relative h-[4rem] gap-2 border-t-2 bg-gray-300 p-0">
        <Control />
      </div>
    </div>
  )
}

const Control: FC = () => {
  const handleClickDemo = () => {
    // empty
  }

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
            <div className="nested-group flex flex-col items-center">
              <ChevronButton
                type="inc"
                onClick={handleClickDemo}
                disabled={false}
              />
              <span>大きさ {"{fs}"}</span>
              <ChevronButton
                type="dec"
                onClick={handleClickDemo}
                disabled={false}
              />
            </div>
            <div className="nested-group flex flex-col items-center">
              <ChevronButton
                type="inc"
                onClick={handleClickDemo}
                disabled={true}
              />
              <span>大きさ {"{fs}"}</span>
              <ChevronButton
                type="dec"
                onClick={handleClickDemo}
                disabled={true}
              />
            </div>
            <div className="nested-group flex flex-col items-center">
              <ChevronButton
                type="inc"
                onClick={handleClickDemo}
                disabled={false}
              />
              <span>大きさ fs</span>
              <ChevronButton
                type="dec"
                onClick={handleClickDemo}
                disabled={false}
              />
            </div>
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
