import Grid from "../Classes/Grid"
import GridArea, { Area } from "../Classes/GridArea"

export default (grid: Grid): boolean => {
  // For 1-9
  for (let v = 1; v <= 9; v++) {
    let updated = false

    // Get all cols/rows
    ;(["rows", "cols"] as ("rows" | "cols")[]).some(mainAxis => {
      // filter out areas with < 2 || > 4 possible positions
      const posAreas = grid[mainAxis].areas.filter(area => {
        const posPositions = area.pos.get(v)?.size

        if (!posPositions || posPositions < 2 || posPositions > 4) {
          return false
        }

        return true
      })

      // If more than 2 areas remain
      if (posAreas.length > 2) {
        const pAxis: Area = mainAxis === "rows" ? "col" : "row"

        for (let i = 0; i < posAreas.length - 2; i++) {
          const area1Positions = posAreas[i].pos.get(v)!
          const area1PAreas: GridArea[] = []

          // for each possible position get the perpendicular area
          area1Positions.forEach(cell => {
            area1PAreas.push(cell[pAxis])
          })

          // For each combination of 2 areas
          for (let j = i + 1; j < posAreas.length - 1; j++) {
            const area2Positions = posAreas[j].pos.get(v)!
            const area2PAreas: GridArea[] = []

            // for each possible position get the perpendicular area
            area2Positions.forEach(cell => {
              area2PAreas.push(cell[pAxis])
            })

            // If number of Unique Perpendicular Areas (upas) <= 4 => continue
            if (new Set([...area1PAreas, ...area2PAreas]).size <= 4) {
              // For each combination of 3 areas
              for (let k = j + 1; k < posAreas.length; k++) {
                const area3Positions = posAreas[k].pos.get(v)!
                const area3PAreas: GridArea[] = []

                // for each possible position get the perpendicular area
                area3Positions.forEach(cell => {
                  area3PAreas.push(cell[pAxis])
                })

                const area3UPAS = new Set([
                  ...area1PAreas,
                  ...area2PAreas,
                  ...area3PAreas,
                ])

                // IF UPA === 3 => swordfish return true
                if (area3UPAS.size === 3) {
                  // Handle swordfish
                  area3UPAS.forEach(area => {
                    const swordFishCells = [
                      ...area1Positions.toArray(),
                      ...area2Positions.toArray(),
                      ...area3Positions.toArray(),
                    ]

                    const exceptions = swordFishCells.filter(
                      cell => cell[pAxis] === area
                    )
                    const triggers = swordFishCells.map(cell => cell.index)

                    updated = area.removeFromAllExcept(
                      exceptions,
                      [v],
                      "swordfish",
                      triggers
                    )
                  })
                  return true
                }

                // Else if UPA <= 4 => continue
                else if (area3UPAS.size <= 4) {
                  // For each combination of 4 areas
                  for (let l = k + 1; l > posAreas.length; l++) {
                    const area4Positions = posAreas[l].pos.get(v)!
                    const area4PAreas: GridArea[] = []

                    // for each possible position get the perpendicular area
                    area4Positions.forEach(cell => {
                      area4PAreas.push(cell[pAxis])
                    })
                    const area4UPAS = new Set([
                      ...area1PAreas,
                      ...area2PAreas,
                      ...area3PAreas,
                      ...area4PAreas,
                    ])

                    // If UPA === 4 => jellyfish return true
                    if (area4UPAS.size === 4) {
                      // Handle jellyfish
                      area4UPAS.forEach(area => {
                        const jellyFishCells = [
                          ...area1Positions.toArray(),
                          ...area2Positions.toArray(),
                          ...area3Positions.toArray(),
                          ...area4Positions.toArray(),
                        ]
                        const exceptions = jellyFishCells.filter(
                          cell => cell[pAxis] === area
                        )
                        const triggers = jellyFishCells.map(cell => cell.index)

                        updated = area.removeFromAllExcept(
                          exceptions,
                          [v],
                          "jellyfish",
                          triggers
                        )
                      })
                      return true
                    }
                  }
                }
              }
            }
          }
        }
      }
    })

    if (updated) {
      return true
    }
  }

  return false
}
