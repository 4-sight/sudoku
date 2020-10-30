import { CellData } from "../types"

export default (cell: CellData): CellData => ({
  ...cell,
  center: new Set(cell.center),
  corner: new Set(cell.corner),
})
