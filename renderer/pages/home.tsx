import { Fragment } from "react"
import Head from "next/head"

import { Editor } from "@/components/organisms/Editor"

const Home = () => {
  return (
    <Fragment>
      <Head>
        <title>(小説のタイトル) - Clara Editor</title>
      </Head>
      <div className="h-screen w-screen">
        <Editor />
      </div>
    </Fragment>
  )
}

export default Home
