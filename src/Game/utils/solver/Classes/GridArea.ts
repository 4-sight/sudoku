import GridCell from "./GridCell"
import Positions from "./Positions"
import { hidden } from "../strategies"
import { Strategy } from "./Grid"

export type Area = "row" | "col" | "box"
type GetNPositionsExclusions = {
  sameRowAll?: true
  sameColAll?: true
  sameBoxAll?: true
  sameRowAny?: true
  sameColAny?: true
  sameBoxAny?: true
  diffRowAll?: true
  diffColAll?: true
  diffBoxAll?: true
  diffRowAny?: true
  diffColAny?: true
  diffBoxAny?: true
}

export default class GridArea {
  cells: GridCell[]
  index: number
  type: Area
  pos: Map<number, Positions>

  constructor(index: number, type: Area, cells: GridCell[] = []) {
    this.index = index
    this.type = type
    this.cells = cells
    this.pos = new Map()
    for (let i = 1; i <= 9; i++) {
      this.pos.set(i, new Positions())
    }
  }

  addCell = (cell: GridCell) => {
    this.cells.push(cell)
  }

  getIndex = (cell: GridCell): number => this.cells.indexOf(cell)

  getCell = (index: number): GridCell => this.cells[index]

  addPos = (n: number, cell: GridCell) => {
    this.pos.get(n)?.add(cell)
  }

  deletePos = (n: number) => {
    this.pos.delete(n)
  }

  updatePos = () => {
    this.pos = new Map()
    for (let i = 1; i <= 9; i++) {
      this.pos.set(i, new Positions())
    }

    this.cells.forEach(cell => {
      const value = cell.getValue()
      if (value) {
        this.deletePos(value)
      } else {
        cell.getPossibilities().forEach(value => {
          this.addPos(value, cell)
        })
      }
    })

    return this.pos
  }

  removeFromAllExcept = (
    exceptions: GridCell[],
    values: number[],
    strategy: Strategy,
    additionalTriggers: number[] = []
  ): boolean => {
    let updated = false
    const triggers = [
      ...exceptions.map(cell => cell.index),
      ...additionalTriggers,
    ]
    this.cells.forEach(cell => {
      if (!cell.getValue() && !exceptions.includes(cell)) {
        updated =
          cell.removePossibilities(values, strategy, triggers) || updated
      }
    })

    return updated
  }

  getNPositions = (
    n: number,
    exclusions?: GetNPositionsExclusions
  ): [GridCell[], number][] => {
    const results: [GridCell[], number][] = []

    this.pos.forEach((positions, value) => {
      if (positions.size === n) {
        let exclude = false
        const cells = positions.toArray()

        if (n > 1 && exclusions) {
          const boxes = new Set(cells.map(cell => cell.box)).size
          const rows = new Set(cells.map(cell => cell.row)).size
          const cols = new Set(cells.map(cell => cell.col)).size

          // Same exclusions
          if (exclusions.sameBoxAll && boxes === 1) {
            exclude = false
          }

          if (exclusions.sameRowAll && rows === 1) {
            exclude = false
          }

          if (exclusions.sameColAll && cols === 1) {
            exclude = false
          }

          if (exclusions.sameBoxAny && boxes < n) {
            exclude = false
          }

          if (exclusions.sameRowAny && rows < n) {
            exclude = false
          }

          if (exclusions.sameColAny && cols < n) {
            exclude = false
          }

          // Diff exclusions
          if (exclusions.diffBoxAll && boxes === n) {
            exclude = false
          }

          if (exclusions.diffRowAll && rows === n) {
            exclude = false
          }

          if (exclusions.diffColAll && cols === n) {
            exclude = false
          }

          if (exclusions.diffBoxAny && boxes !== 1) {
            exclude = false
          }

          if (exclusions.diffRowAny && rows !== 1) {
            exclude = false
          }

          if (exclusions.diffColAny && cols !== 1) {
            exclude = false
          }
        }

        if (!exclude) {
          results.push([cells, value])
        }
      }
    })

    return results
  }

  gradePositionsBySize = (
    triggers: number[]
  ): [[Positions, number][], [Positions, number][], [Positions, number][]] => {
    const posDoubles: [Positions, number][] = []
    const posTriples: [Positions, number][] = []
    const posQuads: [Positions, number][] = []

    // Update possible positions
    this.updatePos()

    // Find potential hidden sets/ singles
    this.pos.forEach((positions, value) => {
      switch (positions.size) {
        case 1:
          const cell = positions.getFirst()
          cell.setValue(value, "hidden single", triggers)
          break

        case 2:
          posDoubles.push([positions, value])
          break

        case 3:
          posTriples.push([positions, value])
          break

        case 4:
          posQuads.push([positions, value])
          break

        default:
          break
      }
    })

    return [posDoubles, posTriples, posQuads]
  }

  matchAreas = (cells: GridCell[]) => {
    const same: {
      box: GridArea | false
      row: GridArea | false
      col: GridArea | false
    } = {
      box: cells[0].box,
      row: cells[0].row,
      col: cells[0].col,
    }

    for (let i = 1; i < cells.length; i++) {
      if (cells[i].box !== same.box) {
        same.box = false
        break
      }
      if (same.row && same.row !== cells[i].row) {
        same.row = false
      }
      if (same.col && same.col !== cells[i].col) {
        same.col = false
      }
    }

    return same
  }

  pointing = (positions: Positions, value: number) => {
    const cells = positions.toArray()
    const pointingStrategy =
      cells.length === 2 ? "pointing pair" : "pointing triple"

    const same = this.matchAreas(cells)

    if (same.box) {
      if (same.row) {
        same.row.removeFromAllExcept(cells, [value], pointingStrategy)

        // remove from rest of box
        same.box.removeFromAllExcept(cells, [value], "box line reduction")
      } else if (same.col) {
        same.col.removeFromAllExcept(cells, [value], pointingStrategy)

        // remove from rest of box
        same.box.removeFromAllExcept(cells, [value], "box line reduction")
      }
    }
  }

  search = (triggers: number[]) => {
    const [doubles, triples, quads] = this.gradePositionsBySize(triggers)

    hidden(doubles, triples, quads)

    // Pointing pairs/ box line reduction
    doubles.forEach(([positions, val]) => this.pointing(positions, val))
    triples.forEach(([positions, val]) => this.pointing(positions, val))
  }
}
