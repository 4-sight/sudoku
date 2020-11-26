import Grid, { Action, Step, Strategy } from "./Grid"
import GridArea from "./GridArea"

export default class GridCell {
  private value: number | null
  index: number
  possibilities: Set<number>
  row: GridArea
  col: GridArea
  box: GridArea
  checking: boolean
  removeFromUnsolved: () => void
  recordStep: (
    strategy: Strategy,
    action: Action,
    actionValues: number[] | null,
    triggers: number[]
  ) => void

  constructor(i: number, grid: Grid, checking: boolean = false) {
    this.value = null
    this.checking = checking
    this.index = i
    this.possibilities = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9])
    this.row = grid.rows.get(Math.floor(i / 9))
    this.col = grid.cols.get(i % 9)
    this.box = grid.boxes.get(Math.floor((i % 9) / 3) + Math.floor(i / 27) * 3)
    this.removeFromUnsolved = () => {
      grid.removeSolved([this.index])
    }
    this.recordStep = (
      strategy: Strategy,
      action: Action,
      actionValues: number[] | null,
      triggers: number[]
    ) => {
      const step: Step = {
        strategy,
        action,
        actionValues,
        triggers,
        location: this.index,
        value: this.value,
        possibilities: Array.from(this.possibilities.values()),
      }
      grid.updateHistory(step)
    }

    grid.cells.push(this)
    grid.unsolved.add(i)
    this.row.addCell(this)
    this.col.addCell(this)
    this.box.addCell(this)
  }

  setGiven = (given: number) => {
    this.value = given
    this.possibilities.clear()
    this.removeFromUnsolved()
  }

  getValue = () => this.value

  getAreas = (filters?: GridArea[]): GridArea[] => {
    return [this.row, this.col, this.box].filter(
      area => !filters?.includes(area)
    )
  }

  matchAreas = (cell: GridCell): GridArea[] => {
    const areas: GridArea[] = []

    this.row === cell.row && areas.push(this.row)
    this.col === cell.col && areas.push(this.col)
    this.box === cell.box && areas.push(this.box)

    return areas
  }

  copyFromCell = (cell: GridCell) => {
    this.value = cell.value

    cell.getPossibilities().forEach(n => {
      this.possibilities.add(n)
    })
  }

  setValue = (v: number, strategy: Strategy, triggers: number[]) => {
    this.value = v

    // Stop solve on error
    if (this.checking && !this.isValid()) {
      throw new Error(`Invalid value found`)
    }

    this.removeFromUnsolved()
    this.possibilities.clear()
    this.recordStep(strategy, "Set Value", [v], triggers)

    this.updateLinked()
  }

  updateLinked = () => {
    if (this.value) {
      const v = this.value
      this.row.deletePos(v)
      this.row.cells.forEach(cell =>
        cell.removePossibilities([v], "elimination", [this.index])
      )
      this.row.search([this.index])

      this.col.deletePos(v)
      this.col.cells.forEach(cell =>
        cell.removePossibilities([v], "elimination", [this.index])
      )
      this.col.search([this.index])

      this.box.deletePos(v)
      this.box.cells.forEach(cell =>
        cell.removePossibilities([v], "elimination", [this.index])
      )
      this.box.search([this.index])
    }
  }

  removePossibilities = (
    p: number[],
    strategy: Strategy,
    triggers: number[]
  ): boolean => {
    let updated = false
    if (!this.value) {
      p.forEach(n => {
        if (this.possibilities.delete(n)) {
          this.recordStep(strategy, "Remove possibility", p, triggers)
          updated = true
        }
      })

      if (this.possibilities.size === 1) {
        this.setValue(
          this.possibilities.values().next().value,
          strategy,
          triggers
        )
      } else {
        if (updated) {
          this.row.search([this.index])
          this.col.search([this.index])
          this.box.search([this.index])
        }
      }
    }

    return updated
  }

  removeAllExcept = (
    values: number[],
    strategy: Strategy,
    triggers: number[]
  ): boolean => {
    const remaining = [...values].filter(n => this.possibilities.has(n))

    if (remaining.length < this.possibilities.size) {
      this.possibilities = new Set(remaining)

      this.recordStep(strategy, "Set possibilities", values, triggers)
      this.row.search([this.index])
      this.col.search([this.index])
      this.box.search([this.index])

      return true
    }

    return false
  }

  getPossibilities = () => {
    return Array.from(this.possibilities.values())
  }

  comparePossibilities = (
    otherCell: GridCell
  ): { common: number[]; uncommon: number[] } => {
    const common = new Set<number>()
    const uncommon = new Set<number>()

    ;[...this.getPossibilities(), ...otherCell.getPossibilities()].forEach(
      value => {
        if (!uncommon.has(value) && !common.has(value)) {
          uncommon.add(value)
        } else {
          uncommon.delete(value)
          common.add(value)
        }
      }
    )

    return {
      common: Array.from(common),
      uncommon: Array.from(uncommon),
    }
  }

  matchPossibilities = (values: number[]): boolean => {
    if (values.length !== this.possibilities.size) {
      return false
    }

    return !values.some(val => !this.possibilities.has(val))
  }

  isValid = (): boolean => {
    return ![this.row, this.col, this.box].some(area => {
      return area.cells.some(cell => cell !== this && cell.value === this.value)
    })
  }
}
