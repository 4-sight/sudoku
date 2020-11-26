import { Givens } from "../../types"
import Grid, { GridState } from "./Classes/Grid"
import GridAreaGroup from "./Classes/GridAreaGroup"
import { bifurcate } from "./strategies/"

export type GridAreaGroups = [GridAreaGroup, GridAreaGroup, GridAreaGroup]

export default (givens: Givens): [GridState[], boolean] => {
  const grid = new Grid(givens)
  const solved = grid.solve()

  if (!solved) {
    const solution = bifurcate(grid)
    if (solution) {
      return [solution.getHistory(), true]
    }
  }

  return [grid.getHistory(), grid.unsolved.size === 0]
}
