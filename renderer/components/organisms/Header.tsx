import { useTheme } from "next-themes"
import { Navbar } from "react-daisyui"

import { useFontType } from "@/hooks"

export const Header = () => {
  const { theme, setTheme } = useTheme()
  const [ft] = useFontType()

  return (
    <div className={"fixed top-0 w-full " + ft}>
      <Navbar className="min-h-[3rem] gap-2 opacity-0 shadow transition-opacity hover:opacity-100">
        <div className="flex flex-1 justify-center text-sm">
          <div
            className="btn btn-xs"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <span>toggle theme</span>
          </div>
        </div>
        <div className="flex flex-1 justify-end"></div>
      </Navbar>
    </div>
  )
}
