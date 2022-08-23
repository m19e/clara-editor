import Head from "next/head"
import Link from "next/link"
import React from "react"
import { Button } from "react-daisyui"

function Next() {
  return (
    <React.Fragment>
      <Head>
        <title>Next - Nextron (with-typescript-tailwindcss)</title>
      </Head>
      <div className="grid-col-1 grid w-full text-center text-2xl">
        <img className="mx-auto" src="/images/logo.png" />
        <span>⚡ Nextron ⚡</span>
      </div>
      <div className="grid w-full place-items-center">
        <Button color="primary">Button test</Button>
      </div>
      <div className="mt-1 flex w-full flex-wrap justify-center">
        <Link href="/home">
          <a className="btn-blue">Go to home page</a>
        </Link>
      </div>
    </React.Fragment>
  )
}

export default Next
