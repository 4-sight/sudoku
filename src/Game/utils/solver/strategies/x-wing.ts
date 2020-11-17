import Grid from "../Classes/Grid"
import GridArea from "../Classes/GridArea"
import GridCell from "../Classes/GridCell"

const xWing = (grid: Grid) => {
  // Search grid
  return [grid.rows, grid.cols].some(areaGroup =>
    // for rows/ cols
    areaGroup.areas.some((area, i) =>
      // for each grid/row find values that can only be in 2 positions (in different boxes, same box pairs are handled by hidden sets)
      findDoubles(area).some(([double, value]) => {
        // Search each subsequent parallel area for the same value present in only 2 positions perpendicular to the first 2
        return findX(double, value, areaGroup.areas, i)
      })
    )
  )
}

export const findDoubles = (
  area: GridArea
): [[GridCell, GridCell], number][] => {
  const doubles: [[GridCell, GridCell], number][] = []

  area.pos.forEach((positions, value) => {
    if (positions.size === 2) {
      const cells = positions.toArray() as [GridCell, GridCell]
      if (cells[0].box !== cells[1].box) {
        doubles.push([cells, value])
      }
    }
  })

  return doubles
}

export const findX = (
  double: [GridCell, GridCell],
  value: number,
  areas: GridArea[],
  index: number
): boolean => {
  let updated = false

  for (let i = index + 1; i < areas.length; i++) {
    const nextArea = areas[i]

    // Get possible positions on value in nextArea
    const possiblePositions = nextArea.pos.get(value)

    // If there are 2 possible positions
    if (possiblePositions && possiblePositions.size === 2) {
      const [posCell0, posCell1] = possiblePositions.toArray()
      const pAxis: "row" | "col" = nextArea.type === "row" ? "col" : "row"
      let wing1: [GridCell, GridCell] | null = null
      let wing2: [GridCell, GridCell] | null = null

      const boxes = new Set([
        double[0].box,
        double[1].box,
        posCell0.box,
        posCell1.box,
      ])

      // All positions must be in different boxes
      if (boxes.size === 4) {
        // If the positions correspond with the cells in double
        // [00, 11] match
        if (
          double[0][pAxis] === posCell0[pAxis] &&
          double[1][pAxis] === posCell1[pAxis]
        ) {
          wing1 = [double[0], posCell0]
          wing2 = [double[1], posCell1]

          // [01, 01] match
        } else if (
          double[0][pAxis] === posCell1[pAxis] &&
          double[1][pAxis] === posCell0[pAxis]
        ) {
          wing1 = [double[0], posCell1]
          wing2 = [double[1], posCell0]
        }

        if (wing1 && wing2) {
          // Remove possible positions on parallel axes
          const triggers = [...wing1, ...wing2].map(cell => cell.index)
          const axis1Updated = wing1[0][pAxis].removeFromAllExcept(
            wing1,
            [value],
            "x-wing",
            triggers
          )

          const axis2Updated = wing2[0][pAxis].removeFromAllExcept(
            wing2,
            [value],
            "x-wing",
            triggers
          )

          // If possibilities were removed
          if (axis1Updated || axis2Updated) {
            updated = true
          }
        }
      }
    }
  }

  return updated
}

export default xWing
