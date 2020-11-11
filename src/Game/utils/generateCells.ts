import { Givens, CellData } from "../types"

const getCell = (index: number, value: number | null = null): CellData => ({
  value,
  fixed: !!value,
  row: Math.floor(index / 9) + 1,
  col: (index % 9) + 1,
  index: index,
  backgroundColor: "",
  corner: new Set(),
  center: new Set(),
  error: false,
  solution: null,
})

export default (givens: Givens): CellData[] => {
  const cells: CellData[] = []

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      cells.push(getCell(i * 9 + j))
    }
  }

  givens.forEach(({ index, value }) => {
    cells.splice(index, 1, getCell(index, value))
  })

  return cells
}
