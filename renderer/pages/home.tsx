import { Fragment } from "react"
import Head from "next/head"

import { useDraftPath } from "@/hooks"
import { Editor } from "@/components/organisms/Editor"

const Home = () => {
  const [draftPath] = useDraftPath()

  return (
    <Fragment>
      <Head>
        <title>{draftPath || "無題"} - Clara Editor</title>
      </Head>
      <Editor />
    </Fragment>
  )
}

export default Home
