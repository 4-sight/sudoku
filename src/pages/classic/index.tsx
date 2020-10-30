import React from "react"
import { graphql, Link, useStaticQuery } from "gatsby"

// Components
import Layout from "../../Components/layout"

export default () => {
  const { allSitePage } = useStaticQuery(
    graphql`
      query {
        allSitePage(filter: { path: { regex: "/(classic/.)/" } }) {
          edges {
            node {
              path
            }
          }
        }
      }
    `
  )

  return (
    <Layout>
      <div>Classic Menu</div>
      {allSitePage.edges.map(
        ({ node: { path } }: { node: { path: string } }, i: number) => (
          <Link to={path}>Puzzle {i + 1}</Link>
        )
      )}
    </Layout>
  )
}
