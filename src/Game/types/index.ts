export type CellData = {
  backgroundColor: string
  value: number | null
  fixed: boolean
  row: number
  col: number
  index: number
  center: Set<number>
  corner: Set<number>
  error: boolean
  solution: {
    value: null | number
    possibilities: number[]
  } | null
}

export type Givens = {
  index: number
  value: number
}[]

export type SudokuVariant = "classic"

export interface SudokuProps {
  givens: string
  variant: SudokuVariant
  date: string
  title: string
}
