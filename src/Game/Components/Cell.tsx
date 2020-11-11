import React from "react"
import { useGameActions, useGameState } from "../context/GameStateContext"
import { CellData } from "../types"
import colors from "../scss/colors.scss"

import CenterMarks from "./CenterMarks"
import CornerMarks from "./CornerMarks"

interface Props {
  data: CellData
  isSelected: boolean
  showSolution: boolean
}

export default ({ data, isSelected, showSolution }: Props) => {
  const {
    backgroundColor,
    value,
    fixed,
    row,
    col,
    index,
    center,
    corner,
    error,
    solution,
  } = data
  const { selectCell, addToSelected } = useGameActions()
  const { selecting } = useGameState()
  return (
    <div
      className={`cell${error ? " cell-error" : ""}`}
      id={`r${row}c${col}`}
      style={{
        borderLeft: `${col % 9 === 1 ? `5px solid ${colors.black1}` : ""}`,
        borderRight: `${
          col % 3 === 0 && col % 9 !== 0
            ? `2px solid ${colors.black1}`
            : col % 9 === 0
            ? `5px solid ${colors.black1}`
            : ""
        }`,
        borderTop: `${row % 9 === 1 ? `5px solid ${colors.black1}` : ""}`,
        borderBottom: `${
          row % 3 === 0 && row % 9 !== 0
            ? `2px solid ${colors.black1}`
            : row % 9 === 0
            ? `5px solid ${colors.black1}`
            : ""
        }`,
        backgroundColor: isSelected
          ? `${colors.highlightCell}`
          : backgroundColor,
        color: fixed ? `${colors.black1}` : "",
        cursor: "pointer",
      }}
      onMouseDown={e => {
        if (!showSolution) {
          e.preventDefault()
          selectCell(index)
        }
      }}
      onMouseEnter={e => {
        if (!showSolution) {
          e.preventDefault()
          if (selecting) {
            addToSelected(index)
          }
        }
      }}
    >
      {showSolution ? (
        solution ? (
          solution.value ? (
            solution.value
          ) : (
            <div className="corner-marks">
              <CornerMarks
                values={solution.possibilities
                  .sort()
                  .slice(0, Math.ceil(solution.possibilities.length / 2))}
                row="top"
              />
              <CornerMarks
                values={solution.possibilities
                  .sort()
                  .slice(Math.ceil(solution.possibilities.length / 2))}
                row="bottom"
              />
            </div>
          )
        ) : null
      ) : value ? (
        value
      ) : (
        <div className="corner-marks">
          <CenterMarks values={Array.from(center.values()).sort()} />
          <CornerMarks
            values={Array.from(corner)
              .sort()
              .slice(0, Math.ceil(corner.size / 2))}
            row="top"
          />
          <CornerMarks
            values={Array.from(corner)
              .sort()
              .slice(Math.ceil(corner.size / 2))}
            row="bottom"
          />
        </div>
      )}
    </div>
  )
}
