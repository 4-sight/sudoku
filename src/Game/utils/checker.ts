import { CellData } from "../types"
import copyCell from "./copyCell"

const compareCells = (cellA: CellData, cellB: CellData): boolean => {
  if (cellA.value === cellB.value) {
    cellA.error = true
    cellB.error = true
    return true
  }
  return false
}

export default (cells: CellData[]): [CellData[], boolean] => {
  // Make immutable and clear errors
  const _cells = [...cells].map(cell => {
    const copy = copyCell(cell)
    copy.error = false
    return copy
  })
  let isCorrect = true

  _cells.map(cell => {
    const { index, value } = cell

    // Check for value
    if (!value) {
      cell.error = true
      isCorrect = false
      return cell
    }

    // Check against rest of row ====================================
    const rowEnd = Math.ceil((index + 1) / 9) * 9 - 1
    const rowInc = 1

    for (let i = index + rowInc; i <= rowEnd; i += rowInc) {
      if (compareCells(cell, _cells[i])) {
        isCorrect = false
      }
    }

    // Check against rest of column ===================================
    const colEnd = 72 + (index % 9)
    const colInc = 9

    for (let i = index + colInc; i <= colEnd; i += colInc) {
      if (compareCells(cell, _cells[i])) {
        isCorrect = false
      }
    }

    //Check against rest of box =======================================
    const boxEnd =
      Math.ceil((index + 1) / 27) * 27 - 9 + Math.floor((index % 9) / 3) * 3 + 2
    const boxInc = (i: number) => ((i + 1) % 3 > 0 ? i + 1 : i + 7)

    for (let i = boxInc(index); i <= boxEnd; i = boxInc(i)) {
      if (compareCells(cell, _cells[i])) {
        isCorrect = false
      }
    }

    return cell
  })

  return [_cells, isCorrect]
}
