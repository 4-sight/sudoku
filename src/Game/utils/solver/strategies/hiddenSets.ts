import GridCell from "../Classes/GridCell"
import Positions from "../Classes/Positions"

export type HiddenSet = {
  values: number[]
  cells: GridCell[]
}

//===================
//===================

export const findDoubles = (
  unmatched: [Positions, number][],
  matched: HiddenSet[] = []
): [[Positions, number][], HiddenSet[]] => {
  unmatched.forEach(([set1, num1], i) => {
    for (let j = i + 1; j < unmatched.length; j++) {
      const [set2, num2] = unmatched[j]

      if (set1.matches(set2)) {
        matched.push({ values: [num1, num2], cells: set1.toArray() })
        unmatched.splice(j, 1)
        unmatched.splice(i, 1)
        return findDoubles(unmatched, matched)
      }
    }
  })

  return [unmatched, matched]
}

//=========================================

export const findTriples = (
  unmatched: [Positions, number][],
  matched: HiddenSet[] = []
): [[Positions, number][], HiddenSet[]] => {
  return [unmatched, matched]
}

//=========================================

export const findQuads = (
  unmatched: [Positions, number][],
  matched: HiddenSet[] = []
): [[Positions, number][], HiddenSet[]] => {
  return [unmatched, matched]
}
