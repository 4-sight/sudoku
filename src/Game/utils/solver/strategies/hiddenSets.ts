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
  const _unmatched = [...unmatched]

  _unmatched.forEach(([set1, num1], i) => {
    for (let j = i + 1; j < _unmatched.length; j++) {
      const [set2, num2] = _unmatched[j]

      if (set1.matches(set2)) {
        matched.push({ values: [num1, num2], cells: set1.toArray() })
        _unmatched.splice(j, 1)
        _unmatched.splice(i, 1)
        return findDoubles(_unmatched, matched)
      }
    }
  })

  return [_unmatched, matched]
}

//=========================================

export const findTriples = (
  unmatched: [Positions, number][],
  matched: HiddenSet[] = []
): [[Positions, number][], HiddenSet[]] => {
  const _unmatched = [...unmatched]

  _unmatched.forEach(([set1, num1], i) => {
    for (let j = i + 1; j < _unmatched.length - 1; j++) {
      const [set2, num2] = _unmatched[j]

      if (!set1.matches(set2)) {
        break
      }

      for (let k = i + 2; k < _unmatched.length; k++) {
        const [set3, num3] = _unmatched[k]

        if (set1.matches(set3)) {
          matched.push({ values: [num1, num2, num3], cells: set1.toArray() })
          _unmatched.splice(k, 1)
          _unmatched.splice(j, 1)
          _unmatched.splice(i, 1)
          return findDoubles(_unmatched, matched)
        }
      }
    }
  })

  return [_unmatched, matched]
}

//=========================================

export const findQuads = (
  unmatched: [Positions, number][],
  matched: HiddenSet[] = []
): [[Positions, number][], HiddenSet[]] => {
  const _unmatched = [...unmatched]

  _unmatched.forEach(([set1, num1], i) => {
    for (let j = i + 1; j < _unmatched.length - 2; j++) {
      const [set2, num2] = _unmatched[j]

      if (!set1.matches(set2)) {
        break
      }

      for (let k = i + 2; k < _unmatched.length - 1; k++) {
        const [set3, num3] = _unmatched[k]

        if (!set1.matches(set3)) {
          break
        }

        for (let l = i + 3; l < _unmatched.length; l++) {
          const [set4, num4] = _unmatched[l]

          if (set1.matches(set4)) {
            matched.push({
              values: [num1, num2, num3, num4],
              cells: set1.toArray(),
            })
            _unmatched.splice(l, 1)
            _unmatched.splice(k, 1)
            _unmatched.splice(j, 1)
            _unmatched.splice(i, 1)
            return findDoubles(_unmatched, matched)
          }
        }
      }
    }
  })

  return [_unmatched, matched]
}
