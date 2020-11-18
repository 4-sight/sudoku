import Grid from "../Classes/Grid"
import { Area } from "../Classes/GridArea"
import GridCell from "../Classes/GridCell"

const yWing = (grid: Grid): boolean => {
  // For any given unsolved cell in the grid
  grid.cells.some(cell1 => {
    // If cell1 has only 2 possible values
    if (cell1.getPossibilities().length === 2) {
      // Search each subsequent cell in each of it's areas
      return cell1.getAreas().some(area => {
        const index = area.getIndex(cell1)

        for (let i = index + 1; i < 9; i++) {
          const cell2 = area.getCell(i)

          // for a cell with only 2 possible values
          if (cell2.getPossibilities().length === 2) {
            // only one of which is shared between the 2 cells
            // 3 unique values from 2 cells
            const yWingValues = new Set([
              ...cell1.getPossibilities(),
              ...cell2.getPossibilities(),
            ])
            if (yWingValues.size === 3) {
              // For each cell in a potential match
              // Search each other connected area for a subsequent cell with:
              // only 2 possible values - equal to the uncommon values of the matched pair
              // no common area with the other 'wing'
              const { uncommon } = cell1.comparePossibilities(cell2)

              return [cell1, cell2].some(pivot => {
                const wing1 = pivot === cell1 ? cell2 : cell1

                return pivot.getAreas([area]).some(area2 => {
                  const index2 = area2.getIndex(pivot)

                  for (let j = index2 + 1; j < 9; j++) {
                    const wing2 = area2.getCell(j)

                    if (
                      wing2.getPossibilities().length === 2 &&
                      wing2.matchPossibilities(uncommon) &&
                      wing2.matchAreas(wing1).length === 0
                    ) {
                      const { common } = wing1.comparePossibilities(wing2)
                      let updated = false
                      const triggers = [pivot.index, wing1.index, wing2.index]

                      // Find the intersection(s) between the 2 wings
                      const intersections = getIntersections(
                        wing1,
                        area.type,
                        wing2,
                        area2.type
                      )

                      // Remove the value common to the two wings from the intersection cells
                      // If any cells were updated return true

                      intersections.forEach(cell => {
                        const _updated = cell.removePossibilities(
                          common,
                          "y-wing",
                          triggers
                        )
                        if (_updated) {
                          updated = true
                        }
                      })

                      return updated
                    }
                  }
                })
              })
            }
          }
        }
      })
    }
  })

  return false
}

const getIntersections = (
  wing1: GridCell,
  area1: Area,
  wing2: GridCell,
  area2: Area
): GridCell[] => {
  const intersections: GridCell[] = []

  wing1[area2].cells.forEach(cell => {
    if (cell[area1] === wing2[area1]) {
      intersections.push(cell)
    }
  })

  return intersections
}

export default yWing
