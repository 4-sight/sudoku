import { useReducer, useState } from "react"
import { CellData, Givens } from "../types"
import { generateCells, copyCell } from "../utils"

type HistoryActions = {
  add: (cells: CellData[]) => void
  undo: () => void
  redo: () => void
}
type History = [currentData: CellData[], actions: HistoryActions]
type HistoryReducer = (
  history: CellData[][],
  payload: { nextState: CellData[]; offset: number }
) => CellData[][]

const historyReducer: HistoryReducer = (history, { nextState, offset }) => {
  return (
    // Trim redundant history and add next state
    [...history.slice(0, history.length - offset), nextState]
      // destructure for immutability
      .map(state => [...state].map(cell => copyCell(cell)))
  )
}

export default (initialGrid: Givens = []): History => {
  const [history, push] = useReducer<HistoryReducer>(historyReducer, [
    generateCells(initialGrid),
  ])
  const [offset, setOffset] = useState<number>(0)

  const add = (cells: CellData[]) => {
    setOffset(0)
    push({ nextState: cells, offset })
  }
  const undo = () => {
    setOffset(Math.min(offset + 1, history.length - 1))
  }
  const redo = () => {
    setOffset(Math.max(offset - 1, 0))
  }

  return [history[history.length - 1 - offset], { add, undo, redo }]
}
