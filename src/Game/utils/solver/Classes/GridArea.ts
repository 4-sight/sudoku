import GridCell from "./GridCell"
import Positions from "./Positions"
import { hidden } from "../strategies"
import { Strategy } from "./Grid"
import { HiddenSet } from "../strategies/hiddenSets"

export type Area = "row" | "col" | "box"

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
        updated = cell.removePossibilities(values, strategy, triggers)
      }
    })

    return updated
  }

  findHidden = (triggers: number[]) => {
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

    posDoubles.length && this.handleHidden(posDoubles)
    posTriples.length && this.handleHidden(posTriples)
    posQuads.length && this.handleHidden(posQuads)
  }

  handleHidden = (posMatches: [Positions, number][]) => {
    let strategy: Strategy = "elimination"
    const setLength = posMatches[0][0].size
    let matched: HiddenSet[] = []
    let unmatched: [Positions, number][] = []

    switch (setLength) {
      case 2:
        strategy = "hidden pair"
        const [_unmatchedDoubles, _matchedDoubles] = hidden.findDoubles(
          posMatches
        )
        matched = _matchedDoubles
        unmatched = _unmatchedDoubles
        break

      case 3:
        strategy = "hidden triple"
        const [_unmatchedTriples, _matchedTriples] = hidden.findTriples(
          posMatches
        )
        matched = _matchedTriples
        unmatched = _unmatchedTriples
        break

      case 4:
        strategy = "hidden quad"
        const [_unmatchedQuads, _matchedQuads] = hidden.findQuads(posMatches)
        matched = _matchedQuads
        unmatched = _unmatchedQuads
        break
    }

    if (posMatches.length >= setLength) {
      matched.forEach(({ values, cells }) => {
        cells.forEach(cell => {
          if (cell.getPossibilities().length > setLength)
            cell.replacePossibilities(
              values,
              strategy,
              cells.map(cell => cell.index)
            )
        })

        this.removeFromAllExcept(cells, values, strategy)
      })

      //pointing pairs / box line reductions
      if ([2, 3].includes(setLength)) {
        unmatched.forEach(([cells, value]) => {
          this.pointing(cells, value)
        })
      }
    } else if (posMatches.length && [2, 3].includes(setLength)) {
      // handle pointing pairs/triples box line
      posMatches.forEach(([positions, value]) => {
        this.pointing(positions, value)
      })
    }
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
    this.findHidden(triggers)
  }
}
