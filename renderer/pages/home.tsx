import React from "react"
import Head from "next/head"

import { Editor } from "@/components/organisms/Editor"

function Home() {
  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <Editor />
      {/* <div className="grid-col-1 grid w-full text-center text-2xl">
        <img className="mx-auto" src="/images/logo.png" />
        <span>⚡ Electron ⚡</span>
        <span>+</span>
        <span>Next.js</span>
        <span>+</span>
        <span>tailwindcss</span>
        <span>=</span>
        <span>💕 </span>
      </div>
      <div className="mt-1 flex w-full flex-wrap justify-center">
        <Link href="/next">
          <a className="btn-blue">Go to next page</a>
        </Link>
      </div> */}
    </React.Fragment>
  )
}

export default Home
