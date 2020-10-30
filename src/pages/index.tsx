import React from "react"
import { Link } from "gatsby"

// Components
import Layout from "../Components/layout"

//===============================================================

export default function index() {
  return (
    <Layout>
      <h1>Home Page</h1>
      <Link to="/classic">Classic Sudoku</Link>
    </Layout>
  )
}
