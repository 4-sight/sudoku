import React from "react"

import Header from "./Header"
import Footer from "./Footer"

import "../../scss/index.scss"

interface Props {
  children: React.ReactNode
  path?: string
}

export default (props: Props) => {
  const { children, path } = props
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  )
}
