require("dotenv").config()
const path = require("path")

const { generateNetlifyConfig, generatePath } = require("./utils")
const { puzzlesData } = require("./pageDataHandlers")
const SudokuTemplate = path.resolve(__dirname, "src/templates/Sudoku.tsx")
const { config } = require("./static/admin")

exports.onPreBootstrap = async () => {
  await generateNetlifyConfig(config)
}

exports.createPages = async ({
  actions: { createPage },
  graphql,
  reporter,
}) => {
  //Puzzles
  const puzzles = await puzzlesData.getAll(graphql, reporter)

  puzzles.forEach(puzzle => {
    createPage({
      path: `${puzzle.variant}/${generatePath(puzzle.date, puzzle.title)}`,
      component: SudokuTemplate,
      context: {
        ...puzzle,
      },
    })
  })
}
