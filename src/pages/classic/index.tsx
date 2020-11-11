import React from "react"
import { graphql, Link, useStaticQuery } from "gatsby"

// Components
import Layout from "../../Components/layout"

interface SitePage {
  path: string
  context: { title: string; date: string }
}

export default () => {
  const {
    allSitePage,
  }: {
    allSitePage: {
      nodes: SitePage[]
    }
  } = useStaticQuery(
    graphql`
      query {
        allSitePage(filter: { path: { regex: "/(classic/.)/" } }) {
          nodes {
            path
            context {
              date
              title
            }
          }
        }
      }
    `
  )

  return (
    <Layout>
      <h1>Classic Menu</h1>
      {allSitePage.nodes
        .sort((l1, l2) => Number(l1.context.date) - Number(l2.context.date))
        .map(({ path, context: { title } }) => (
          <Link className="link" to={path}>
            {title}
          </Link>
        ))}
    </Layout>
  )
}
