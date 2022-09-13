import Head from "next/head"
import { parse } from "path"

import { useIsSaved, useDraftPath } from "@/hooks"

export const MetaHead = () => {
  const [isSaved] = useIsSaved()
  const [draftPath] = useDraftPath()

  const mark = isSaved ? "" : "*"
  const title = draftPath ? parse(draftPath).base : "無題"

  return (
    <Head>
      <title>
        {mark}
        {title} - Clara Editor
      </title>
    </Head>
  )
}
