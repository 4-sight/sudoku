import Grid from "../Classes/Grid"
// import Worker from "workerize-loader!../workers/bifurcate.worker.ts"

export interface Message {
  message: "test" | "start" | "addToStack" | "solved" | "failed"
  payload: any
}

export const bifurcate = (grid: Grid): Grid | null => {
  let solution: Grid | null = null

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
      // Create cloned grid
      const newGrid = new Grid([], {
        checking: true,
        clone: grid,
        nextMove: { cellIndex: least.index, value: val, strategy: "bifurcate" },
      })

      if (newGrid.solve()) {
        // If solved
        solution = newGrid
        return true
      } else {
        // If unsolved recurse
        const nextBranch = bifurcate(newGrid)
        solution = nextBranch
        return !!nextBranch
      }
    } catch {
      // On invalid value
      return false
    }
  })

  return solution
}

export default bifurcate
