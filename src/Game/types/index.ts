export type Cells = { col: number; row: number; value: number }[]
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
}
