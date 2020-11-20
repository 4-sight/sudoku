import Positions from "../Classes/Positions"

const hidden = (
  positions: [Positions, number][],
  triples: [Positions, number][],
  quads: [Positions, number][],
  target: 2 | 3 | 4 = 2
) => {
  for (let i = 0; i < positions.length - (target - 1); i++) {
    const [set1, num1] = positions[i]

    for (let j = i + 1; j < positions.length - (target - 2); j++) {
      const [set2, num2] = positions[j]

      if (target === 2) {
        // Hidden pair
        if (set1.matches(set2)) {
          const triggers = set1.toArray().map(cell => cell.index)
          let updated = false
          set1.forEach(cell => {
            if (cell.getPossibilities().length > 2) {
              if (cell.removeAllExcept([num1, num2], "hidden pair", triggers)) {
                updated = true
              }
            }
          })
          if (updated) {
            // Remove matched positions, recurse
            positions.splice(j, 1)
            positions.splice(i, 1)
            hidden(positions, triples, quads, 2)
            return
          }
        }
      } else {
        for (let k = j + 1; k < positions.length - (target - 3); k++) {
          const [set3, num3] = positions[k]

          if (target === 3) {
            const uniquePositions = new Set([
              ...set1.toArray(),
              ...set2.toArray(),
              ...set3.toArray(),
            ])

            // Hidden triple
            if (uniquePositions.size === 3) {
              let updated = false
              const triggers = Array.from(uniquePositions).map(
                cell => cell.index
              )
              uniquePositions.forEach(cell => {
                if (
                  cell.removeAllExcept(
                    [num1, num2, num3],
                    "hidden triple",
                    triggers
                  )
                ) {
                  updated = true
                }
              })

              if (updated) {
                // Remove matched positions, recurse
                positions.splice(k, 1)
                positions.splice(j, 1)
                positions.splice(i, 1)
                hidden(positions, triples, quads, 3)
                return
              }
            }
          } else {
            for (let l = k + 1; l < positions.length; l++) {
              const [set4, num4] = positions[l]

              const uniquePositions = new Set([
                ...set1.toArray(),
                ...set2.toArray(),
                ...set3.toArray(),
                ...set4.toArray(),
              ])

              // Hidden Quad
              if (uniquePositions.size === 4) {
                let updated = false
                const triggers = Array.from(uniquePositions).map(
                  cell => cell.index
                )
                uniquePositions.forEach(cell => {
                  if (
                    cell.removeAllExcept(
                      [num1, num2, num3, num4],
                      "hidden quad",
                      triggers
                    )
                  ) {
                    updated = true
                  }
                })

                if (updated) {
                  // Remove matched positions, recurse
                  positions.splice(l, 1)
                  positions.splice(k, 1)
                  positions.splice(j, 1)
                  positions.splice(i, 1)
                  hidden(positions, triples, quads, 4)
                  return
                }
              }
            }
          }
        }
      }
    }
  }

  switch (target) {
    case 2:
      hidden([...positions, ...triples], [], quads, 3)
      return

    case 3:
      hidden([...positions, ...quads], [], [], 4)
      return
  }
}

export default hidden
