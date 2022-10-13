import { app } from "electron"
import serve from "electron-serve"
import { createWindow } from "./helpers"

const IS_PROD: boolean = process.env.NODE_ENV === "production"

if (IS_PROD) {
  serve({ directory: "app" })
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`)
}

;(async () => {
  await app.whenReady()

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
    minWidth: 640,
    minHeight: 480,
  })

  if (IS_PROD) {
    await mainWindow.loadURL("app://./home.html")
  } else {
    const port = process.argv[2]
    await mainWindow.loadURL(`http://localhost:${port}/home`)
    mainWindow.webContents.openDevTools()
  }
})()

app.on("window-all-closed", () => {
  app.quit()
})
