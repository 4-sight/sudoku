import { Givens } from "../../../types"
import GridAreaGroup from "./GridAreaGroup"
import GridCell from "./GridCell"
import { xWing, yWing } from "../strategies"

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

export default class Grid {
  cells: GridCell[]
  rows: GridAreaGroup
  cols: GridAreaGroup
  boxes: GridAreaGroup
  unsolved: Set<number>
  history: string[]

  constructor(givens: Givens) {
    this.cells = []
    this.rows = new GridAreaGroup("row")
    this.cols = new GridAreaGroup("col")
    this.boxes = new GridAreaGroup("box")
    this.unsolved = new Set<number>()
    this.history = []

    for (let i = 0; i < 81; i++) {
      new GridCell(i, this)
    }

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
  }

  removeSolved = (solved: number[]) => {
    solved.forEach(cellIndex => {
      this.unsolved.delete(cellIndex)
    })
  }

  solve = () => {
    // Search by cell
    this.cells.forEach(cell => cell.updateLinked())

    if (this.unsolved.size) {
      this.advancedSolve()
    }
  }

  advancedSolve = () => {
    const strategies: ((grid: Grid) => boolean)[] = [xWing, yWing]

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
