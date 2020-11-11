import { Givens } from "../../types"
import Grid, { GridState } from "./Classes/Grid"
import GridAreaGroup from "./Classes/GridAreaGroup"

export type GridAreaGroups = [GridAreaGroup, GridAreaGroup, GridAreaGroup]

export default (givens: Givens): [GridState[], boolean] => {
  const grid = new Grid(givens)
  grid.solve()
  return [grid.getHistory(), grid.unsolved.size === 0]
}
