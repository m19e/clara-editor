import Head from "next/head"
import { Fragment } from "react"
import { parse } from "path"

import { useDraftPath } from "@/hooks"
import { Editor } from "@/components/organisms/Editor"

const Home = () => {
  const [draftPath] = useDraftPath()
  const title = draftPath ? parse(draftPath).base : "無題"

  return (
    <Fragment>
      <Head>
        <title>{title} - Clara Editor</title>
      </Head>
      <Editor />
    </Fragment>
  )
}

export default Home
