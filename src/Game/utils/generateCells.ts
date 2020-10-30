import { Cells, CellData } from "../types"

const getCell = (
  row: number,
  col: number,
  value: number | null = null
): CellData => ({
  value,
  fixed: !!value,
  row: row + 1,
  col: col + 1,
  index: row * 9 + col,
  backgroundColor: "",
  corner: new Set(),
  center: new Set(),
  error: false,
})

export default (starter: Cells): CellData[] => {
  const cells: CellData[] = []

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push(getCell(i, j))
    }
  }

  starter.forEach(({ row, col, value }) => {
    const index = (row - 1) * 9 + (col - 1)
    cells.splice(index, 1, getCell(row - 1, col - 1, value))
  })

  return cells
}
