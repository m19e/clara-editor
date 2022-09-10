import type { OpenDialogOptions, OpenDialogReturnValue } from "electron"
import { useTheme } from "next-themes"
import { Navbar } from "react-daisyui"

import { useDraftPath, useFontType } from "@/hooks"
import { ipc } from "@/lib/electron/ipc"

export const Header = () => {
  const { theme, setTheme } = useTheme()
  const [draftPath, setDraftPath] = useDraftPath()
  const [ft] = useFontType()

  const handleOpenDialog = async () => {
    const res = await ipc<OpenDialogOptions, OpenDialogReturnValue>(
      "open-file-dialog",
      {
        title: "ファイルを選択",
        filters: [
          {
            name: "テキストファイル",
            extensions: ["txt"],
          },
        ],
        properties: ["openFile"],
      }
    )
    const { filePaths, canceled } = res
    if (canceled || filePaths.length !== 1) {
      return
    }
    const [fp] = filePaths
    setDraftPath(fp)
  }

  return (
    <div className={`fixed top-0 w-full ${ft}`}>
      <Navbar className="min-h-[3rem] gap-2 opacity-0 shadow transition-opacity hover:opacity-100">
        <div className="flex flex-1 justify-start">
          <div className="btn btn-xs" onClick={handleOpenDialog}>
            open dialog
          </div>
        </div>
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
