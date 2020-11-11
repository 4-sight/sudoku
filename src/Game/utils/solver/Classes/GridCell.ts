import Grid, { Action, Step, Strategy } from "./Grid"
import GridArea from "./GridArea"

export default class GridCell {
  private value: number | null
  index: number
  possibilities: Set<number>
  row: GridArea
  col: GridArea
  box: GridArea
  removeFromUnsolved: () => void
  recordStep: (
    strategy: Strategy,
    action: Action,
    actionValues: number[] | null,
    triggers: number[]
  ) => void

  constructor(i: number, grid: Grid) {
    this.value = null
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

  setValue = (v: number, strategy: Strategy, triggers: number[]) => {
    this.value = v
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
  ) => {
    if (!this.value) {
      let updated = false
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
          this.row.search(triggers)
          this.col.search(triggers)
          this.box.search(triggers)
        }
      }
    }
  }

  replacePossibilities = (
    values: number[],
    strategy: Strategy,
    triggers: number[]
  ) => {
    this.possibilities = new Set(values)

    this.recordStep(strategy, "Set possibilities", values, triggers)
    this.row.search(triggers)
    this.col.search(triggers)
    this.box.search(triggers)
  }

  getPossibilities = () => {
    return Array.from(this.possibilities.values())
  }
}
