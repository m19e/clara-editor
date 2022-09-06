import React from "react"
import type { AppProps } from "next/app"
import { RecoilRoot } from "recoil"
import { ThemeProvider } from "next-themes"

import "@/styles/globals.css"

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <ThemeProvider defaultTheme="light">
      <RecoilRoot>
        <Component {...pageProps} />
      </RecoilRoot>
    </ThemeProvider>
  )
}

export default App
