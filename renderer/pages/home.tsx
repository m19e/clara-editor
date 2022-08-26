import React from "react"
import Head from "next/head"

import { Editor } from "@/components/organisms/Editor"

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <div className="h-screen w-screen">
        <Editor />
      </div>
    </React.Fragment>
  )
}

export default Home
