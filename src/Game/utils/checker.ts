import { CellData } from "../types"
import copyCell from "./copyCell"

export default (cells: CellData[]): [CellData[], boolean] => {
  // Make immutable
  const _cells = [...cells].map(cell => copyCell(cell))
  let isCorrect = true

  // Duplicates/ null in row
  const rows: CellData[][] = [[], [], [], [], [], [], [], [], []]
  _cells.forEach((cell, i) => {
    rows[Math.floor(i / 9)].push(cell)
  })

  rows.forEach(row => {
    row.forEach((cell, index) => {
      if (!cell.error) {
        if (!cell.value) {
          cell.error = true
          isCorrect = false
        } else {
          for (let i = index + 1; i < 9; i++) {
            if (cell.value === row[i].value) {
              cell.error = true
              row[i].error = true
              isCorrect = false
            }
          }
        }
      } else {
        isCorrect = false
      }
    })
  })

  // Duplicates/ null in col
  const cols: CellData[][] = [[], [], [], [], [], [], [], [], []]
  _cells.forEach((cell, i) => {
    cols[i % 9].push(cell)
  })

  cols.forEach(col => {
    col.forEach((cell, index) => {
      if (!cell.error) {
        if (!cell.value) {
          cell.error = true
          isCorrect = false
        } else {
          for (let i = index + 1; i < 9; i++) {
            if (cell.value === col[i].value) {
              cell.error = true
              col[i].error = true
              isCorrect = false
            }
          }
        }
      } else {
        isCorrect = false
      }
    })
  })

  // Duplicates/ null in box
  const boxes: CellData[][] = [[], [], [], [], [], [], [], [], []]
  _cells.forEach((cell, i) => {
    boxes[(Math.floor(i / 3) % 3) + Math.floor(i / 27) * 3].push(cell)
  })

  boxes.forEach(box => {
    box.forEach((cell, index) => {
      if (!cell.error) {
        if (!cell.value) {
          cell.error = true
          isCorrect = false
        } else {
          for (let i = index + 1; i < 9; i++) {
            if (cell.value === box[i].value) {
              cell.error = true
              box[i].error = true
              isCorrect = false
            }
          }
        }
      } else {
        isCorrect = false
      }
    })
  })

  return [_cells, isCorrect]
}
