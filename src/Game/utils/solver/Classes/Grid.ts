import { Givens } from "../../../types"
import GridAreaGroup from "./GridAreaGroup"
import GridCell from "./GridCell"
import { xWing, yWing, fish } from "../strategies"

export type Strategy =
  | "givens"
  | "elimination"
  | "naked pair"
  | "naked triple"
  | "naked quad"
  | "hidden single"
  | "hidden pair"
  | "hidden triple"
  | "hidden quad"
  | "pointing pair"
  | "pointing triple"
  | "box line reduction"
  | "x-wing"
  | "skyscraper"
  | "y-wing"
  | "swordfish"
  | "jellyfish"
  | "bifurcate"

export type Action =
  | "Set Value"
  | "Remove possibility"
  | "Set possibilities"
  | "Set givens"

export type Step = {
  location: number
  strategy: Strategy
  value: number | null
  possibilities: number[]
  triggers: number[]
  action: Action
  actionValues: number[] | null
}

export type CellState = {
  value: number | null
  possibilities: number[]
  fixed: boolean
}
export type GridState = {
  cells: CellState[]
  strategy: Strategy
  action: Action
  changedCell: number | null
  triggers: number[]
  actionValues: number[] | null
}
export type Solution = GridState[]

export type CloneOptions = {
  checking?: boolean
  givens?: Givens[]
  bifurcate?: {
    index: number
    value: number
  }
}
export type GridOptions = {
  checking?: boolean
  clone?: Grid
  nextMove?: {
    cellIndex: number
    value: number
    strategy: Strategy
  }
}

export default class Grid {
  cells: GridCell[]
  rows: GridAreaGroup
  cols: GridAreaGroup
  boxes: GridAreaGroup
  unsolved: Set<number>
  history: string[]

  constructor(givens: Givens, options: GridOptions = {}) {
    this.cells = []
    this.rows = new GridAreaGroup("row")
    this.cols = new GridAreaGroup("col")
    this.boxes = new GridAreaGroup("box")
    this.unsolved = new Set<number>()
    this.history = []

    for (let i = 0; i < 81; i++) {
      new GridCell(i, this, options.checking)
    }

    if (!options.clone) {
      givens.forEach(({ index, value }) => {
        this.cells[index].setGiven(value)
        this.unsolved.delete(index)
      })

      // Set initial grid state in history
      const initialState: GridState = {
        cells: this.cells.map(cell => ({
          value: cell.getValue(),
          possibilities: cell.getPossibilities(),
          fixed: !!cell.getValue(),
        })),
        strategy: "givens",
        action: "Set givens",
        actionValues: null,
        triggers: givens.map(cell => cell.index),
        changedCell: null,
      }
      this.history.push(JSON.stringify(initialState))
    } else {
      // Clone cells
      const srcCells = options.clone.cells
      this.cells.forEach((newCell, i) => {
        newCell.copyFromCell(srcCells[i])
      })

      // Clone area positions
      const { rows, cols, boxes } = options.clone

      rows.areas.forEach((row, i) => {
        this.rows.get(i).copyPositions(row.pos, this)
      })
      cols.areas.forEach((col, i) => {
        this.cols.get(i).copyPositions(col.pos, this)
      })
      boxes.areas.forEach((box, i) => {
        this.boxes.get(i).copyPositions(box.pos, this)
      })

      // Clone unsolved
      this.unsolved = new Set(options.clone.unsolved)

      // Clone history
      this.history = [...options.clone.history]

      if (options.nextMove) {
        const { cellIndex, value, strategy } = options.nextMove

        this.cells[cellIndex].setValue(value, strategy, [])
      }
    }
  }

  getUnsolved = () => {
    return Array.from(this.unsolved)
  }

  removeSolved = (solved: number[]) => {
    solved.forEach(cellIndex => {
      this.unsolved.delete(cellIndex)
    })
  }

  solve = (): boolean => {
    this.cells.forEach(cell => cell.updateLinked())

    if (this.unsolved.size) {
      this.advancedSolve()
    }

    return this.unsolved.size === 0
  }

  advancedSolve = () => {
    const strategies: ((grid: Grid) => boolean)[] = [xWing, yWing, fish]

    // Call each strategy
    strategies.some(strategy => {
      // if strategy has updated grid and unsolved cells remain then recurse
      if (strategy(this) && this.unsolved.size) {
        this.advancedSolve()
      }
    })
  }

  getHistory = (): Solution =>
    this.history.map(stateString => JSON.parse(stateString))

  updateHistory = ({
    value,
    possibilities,
    action,
    triggers,
    strategy,
    location,
    actionValues,
  }: Step) => {
    const lastHistory = this.history.slice(-1)[0]

    if (lastHistory) {
      const lastState: GridState = JSON.parse(lastHistory)

      const nextCells = lastState.cells
      nextCells[location].value = value
      nextCells[location].possibilities = possibilities

      const newState: GridState = {
        cells: nextCells,
        strategy,
        changedCell: location,
        triggers,
        action,
        actionValues,
      }
      this.history.push(JSON.stringify(newState))
    }
  }
}
