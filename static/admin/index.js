const url = require("url")
const { REPOSITORY_URL, NETLIFY } = process.env

const _repo = REPOSITORY_URL
  ? url.parse(REPOSITORY_URL).path
  : "https://github.com/4-sight/sudoku.git"

exports.config = {
  backend: {
    name: "git-gateway",
    repo: _repo,
  },

  local_backend: !NETLIFY,

  media_folder: "content/assets",
  public_folder: "assets",

  collections: [
    // Classic
    {
      name: "classics",
      label: "Classic Sudokus",
      label_singular: "Classic Sudoku",
      folder: "content/puzzles",
      slug: "{{date}}",
      identifier_field: "title",
      extension: "json",
      create: true,
      fields: [
        {
          name: "date",
          label: "Aired Date",
          widget: "datetime",
          format: "YY-MM-DD",
          date_format: "DD-MM-YYYY",
          time_format: false,
          required: true,
        },
        {
          name: "title",
          label: "Title",
          widget: "string",
          required: true,
        },
        {
          name: "variant",
          widget: "hidden",
          default: "classic",
        },
        {
          name: "givens",
          label: "Givens",
          widget: "sudoku",
        },
      ],
    },
  ],
}
