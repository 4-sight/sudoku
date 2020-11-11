import React from "react"
import { TemplateProps, PageContext, PuzzleData } from "../types"
import Sudoku from "../Game"
import Layout from "../Components/layout"

interface Props extends TemplateProps {
  pageContext: PageContext & PuzzleData
}

export default ({ pageContext }: Props) => {
  return (
    <Layout title={pageContext.title}>
      <Sudoku {...pageContext} />
    </Layout>
  )
}
