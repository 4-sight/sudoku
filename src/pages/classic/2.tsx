import React from "react"

// Components
import Layout from "../../Components/layout"
import Game from "../../Game"
import { Cells } from "../../Game/types"

const initialCells: Cells = [
  {
    col: 1,
    row: 1,
    value: 1,
  },
  {
    col: 5,
    row: 1,
    value: 6,
  },
  {
    col: 9,
    row: 1,
    value: 3,
  },
  {
    col: 2,
    row: 2,
    value: 2,
  },
  {
    col: 3,
    row: 2,
    value: 3,
  },
  {
    col: 5,
    row: 2,
    value: 5,
  },
  {
    col: 8,
    row: 2,
    value: 8,
  },
  {
    col: 4,
    row: 3,
    value: 4,
  },
  {
    col: 8,
    row: 3,
    value: 9,
  },
  {
    col: 4,
    row: 4,
    value: 8,
  },
  {
    col: 7,
    row: 4,
    value: 6,
  },
  {
    col: 3,
    row: 5,
    value: 4,
  },
  {
    col: 7,
    row: 5,
    value: 8,
  },
  {
    col: 3,
    row: 6,
    value: 5,
  },
  {
    col: 6,
    row: 6,
    value: 7,
  },
  {
    col: 2,
    row: 7,
    value: 7,
  },
  {
    col: 6,
    row: 7,
    value: 4,
  },
  {
    col: 2,
    row: 8,
    value: 9,
  },
  {
    col: 5,
    row: 8,
    value: 1,
  },
  {
    col: 7,
    row: 8,
    value: 3,
  },
  {
    col: 8,
    row: 8,
    value: 7,
  },
  {
    col: 1,
    row: 9,
    value: 5,
  },
  {
    col: 5,
    row: 9,
    value: 8,
  },
  {
    col: 9,
    row: 9,
    value: 1,
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
