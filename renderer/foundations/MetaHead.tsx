import Head from "next/head"
import { parse } from "path"

import { useIsFallback, useIsSaved, useDraftPath } from "@/hooks"

export const MetaHead = () => {
  const [isFallback] = useIsFallback()
  const [isSaved] = useIsSaved()
  const [draftPath] = useDraftPath()

  const mark = isSaved ? "" : "*"
  const title = draftPath ? parse(draftPath).base : "無題"

  if (isFallback) {
    return (
      <Head>
        <title>読み込み中 - Clara Editor</title>
      </Head>
    )
  }

  return (
    <Head>
      <title>
        {mark}
        {title} - Clara Editor
      </title>
    </Head>
  )
}
