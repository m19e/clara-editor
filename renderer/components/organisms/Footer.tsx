export const Footer = () => {
  return (
    <div className="navbar group border-t-base-300 relative h-12 gap-2 overflow-visible border-t-2 bg-gray-300 p-0">
      {/* <div className="prose absolute top-full z-10 flex flex-col gap-4 delay-500 duration-200 hover:!-top-full group-hover:top-1/2"> */}
      <div className="absolute -bottom-full flex w-full justify-center delay-500 duration-150 hover:!bottom-0 group-hover:-bottom-6">
        <div className="bg-base-300 flex w-full flex-col items-center">
          <div className="h-6">
            <span className="">書式設定</span>
          </div>
          <div className="flex items-center gap-4">
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
