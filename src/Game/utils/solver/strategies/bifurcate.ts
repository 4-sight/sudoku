import { Givens } from "../../../types"
import Grid from "../Classes/Grid"
// import Worker from "workerize-loader!../workers/bifurcate.worker.ts"

export interface Message {
  message: "test" | "start" | "addToStack" | "solved" | "failed"
  payload: any
}

export const bifurcate = (grid: Grid): Grid | null => {
  let solution: Grid | null = null

  // Create new givens from previous grid values
  const givens = grid.cells.reduce((givens, { index, getValue }) => {
    const value = getValue()
    if (value) {
      givens.push({ index, value })
    }
    return givens
  }, [] as Givens)

  // Find the cell with the least possibilities
  const least = grid
    .getUnsolved()
    .map(index => grid.cells[index])
    .sort(
      (cellA, cellB) => cellA.possibilities.size - cellB.possibilities.size
    )[0]

  // Loop through each possibility
  least.getPossibilities().some(val => {
    try {
      const nextGivens = [...givens, { index: least.index, value: val }]
      const newGrid = new Grid(nextGivens, true)

      if (newGrid.solve()) {
        // If solved
        solution = newGrid
        return true
      } else {
        // If unsolved recurse
        return !!bifurcate(newGrid)
      }
    } catch {
      // On invalid value
      return false
    }
  })

  return solution
}

export default bifurcate
