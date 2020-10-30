import React from "react"
import { useGameActions, useGameState } from "../context/GameStateContext"
import { CellData } from "../types"

interface Props {
  data: CellData
  isSelected: boolean
}

export default ({ data, isSelected }: Props) => {
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
  } = data
  const { selectCell, addToSelected } = useGameActions()
  const { selecting } = useGameState()
  return (
    <div
      className={`cell ${error && "cell-error"}`}
      id={`r${row}c${col}`}
      style={{
        borderLeft: `${col % 9 === 1 ? "5px solid black" : ""}`,
        borderRight: `${
          col % 3 === 0 && col % 9 !== 0
            ? "2px solid black"
            : col % 9 === 0
            ? "5px solid black"
            : ""
        }`,
        borderTop: `${row % 9 === 1 ? "5px solid black" : ""}`,
        borderBottom: `${
          row % 3 === 0 && row % 9 !== 0
            ? "2px solid black"
            : row % 9 === 0
            ? "5px solid black"
            : ""
        }`,
        backgroundColor: isSelected ? "yellow" : backgroundColor,
        color: fixed ? "black" : "",
        cursor: "pointer",
      }}
      onMouseDown={e => {
        e.preventDefault()
        selectCell(index)
      }}
      onMouseEnter={e => {
        e.preventDefault()
        if (selecting) {
          addToSelected(index)
        }
      }}
    >
      {value ? (
        value
      ) : (
        <>
          <div className="center-marks">{center}</div>
          <div className="corner-marks">
            <div className="row top-row">
              {Array.from(corner)
                .slice(0, Math.ceil(corner.size / 2))
                .map(n => (
                  <div className="corner-mark" key={n}>
                    {n}
                  </div>
                ))}
            </div>
            <div className="row bottom-row">
              {Array.from(corner)
                .slice(Math.ceil(corner.size / 2))
                .map(n => (
                  <div className="corner-mark" key={n}>
                    {n}
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
