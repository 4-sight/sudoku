import React from "react"

// Components
import Layout from "../../Components/layout"
import Game from "../../Game"
import { Cells } from "../../Game/types"

const initialCells: Cells = [
  {
    col: 5,
    row: 1,
    value: 5,
  },
  {
    col: 7,
    row: 1,
    value: 7,
  },
  {
    col: 9,
    row: 1,
    value: 2,
  },
  {
    col: 1,
    row: 2,
    value: 8,
  },
  {
    col: 4,
    row: 3,
    value: 1,
  },
  {
    col: 8,
    row: 3,
    value: 5,
  },
  {
    col: 9,
    row: 3,
    value: 4,
  },
  {
    col: 5,
    row: 4,
    value: 3,
  },
  {
    col: 1,
    row: 5,
    value: 1,
  },
  {
    col: 2,
    row: 5,
    value: 3,
  },
  {
    col: 4,
    row: 5,
    value: 7,
  },
  {
    col: 5,
    row: 5,
    value: 6,
  },
  {
    col: 8,
    row: 5,
    value: 8,
  },
  {
    col: 2,
    row: 6,
    value: 6,
  },
  {
    col: 3,
    row: 6,
    value: 4,
  },
  {
    col: 7,
    row: 6,
    value: 1,
  },
  {
    col: 1,
    row: 7,
    value: 3,
  },
  {
    col: 2,
    row: 7,
    value: 1,
  },
  {
    col: 3,
    row: 7,
    value: 2,
  },
  {
    col: 5,
    row: 7,
    value: 8,
  },
  {
    col: 2,
    row: 8,
    value: 9,
  },
  {
    col: 6,
    row: 8,
    value: 5,
  },
  {
    col: 6,
    row: 9,
    value: 3,
  },
  {
    col: 7,
    row: 9,
    value: 9,
  },
]

//===============================================================

export default function index() {
  return (
    <Layout>
      <Game initialCells={initialCells} />
    </Layout>
  )
}
