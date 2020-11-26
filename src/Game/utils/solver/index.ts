import { Givens } from "../../types"
import Grid, { GridState } from "./Classes/Grid"
import GridAreaGroup from "./Classes/GridAreaGroup"
import { bifurcate } from "./strategies/"

export type GridAreaGroups = [GridAreaGroup, GridAreaGroup, GridAreaGroup]

export default (givens: Givens): [GridState[], boolean] => {
  const grid = new Grid(givens)
  const startTime = Date.now()
  const solved = grid.solve()

  if (!solved) {
    const solution = bifurcate(grid)
    if (solution) {
      console.log(`Solved in: ${Date.now() - startTime}ms`)
      return [solution.getHistory(), true]
    }
  }

  if (solved) {
    console.log(`Solved in: ${Date.now() - startTime}ms`)
  }
  return [grid.getHistory(), grid.unsolved.size === 0]
}
