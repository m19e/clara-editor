/* eslint-disable tailwindcss/enforces-negative-arbitrary-values */
export const Footer = () => {
  return (
    <div className="fixed bottom-0 w-full">
      <div className="group border-t-base-300 relative h-[4rem] gap-2 border-t-2 bg-gray-300 p-0">
        <Control />
      </div>
    </div>
  )
}

// Control container height => 24rem
// Control label height => 3rem
const Control = () => {
  return (
    <div className="-bottom-[8rem absolute -bottom-0 flex w-full justify-center delay-500 duration-150 hover:!bottom-0 group-hover:-bottom-[calc(8rem-3rem)]">
      <div className="bg-base-100 flex h-[8rem] w-full flex-col items-center shadow">
        <div className="bg-gray-30 flex h-[3rem] items-center">
          <span className="text-base">書式設定</span>
        </div>
        <div className="flex-1">
          <div className="flex h-[3rem] items-center gap-4">
            <span>設定1</span>
            <span>設定2</span>
            <span>設定3</span>
            <span>設定4</span>
          </div>
        </div>
      </div>
    </div>
  )
}
