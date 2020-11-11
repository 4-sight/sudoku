function getAll(graphql, reporter) {
  return new Promise((res, rej) => {
    graphql(`
      query {
        allPuzzles {
          nodes {
            date
            givens
            variant
            title
          }
        }
      }
    `).then(({ data, errors }) => {
      if (errors) {
        reporter.panicOnBuild(`GraphQL error fetching allPuzzles, ${errors}`)
        rej()
      } else {
        res(data.allPuzzles.nodes)
      }
    })
  })
}

exports.getAll = getAll
