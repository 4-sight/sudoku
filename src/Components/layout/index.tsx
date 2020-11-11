import React from "react"

import Header from "./Header"
import Footer from "./Footer"

import "../../scss/index.scss"

interface Props {
  children: React.ReactNode
  path?: string
  title?: string
}

export default (props: Props) => {
  const { children, title } = props
  return (
    <>
      <Header title={title} />
      <main id="page">{children}</main>
      <Footer />
    </>
  )
}
