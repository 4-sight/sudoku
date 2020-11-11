import React from "react"
import colors from "../scss/colors.scss"

import CornerMarks from "./CornerMarks"

interface Props {
  isChanged: boolean
  value: null | number
  possibilities: number[]
  index: number
  fixed: boolean
  isTrigger: boolean
}

export default ({
  isChanged,
  value,
  possibilities,
  index,
  fixed,
  isTrigger,
}: Props) => {
  return (
    <div
      className="cell"
      style={{
        borderLeft: `${index % 9 === 0 ? `5px solid ${colors.black1}` : ""}`,
        borderRight: `${
          index % 3 === 2 && index % 9 !== 8
            ? `2px solid ${colors.black1}`
            : index % 9 === 8
            ? `5px solid ${colors.black1}`
            : ""
        }`,
        borderTop: `${
          Math.floor(index / 9) === 0 ? `5px solid ${colors.black1}` : ""
        }`,
        borderBottom: `${
          Math.floor(index / 9) % 3 === 2 && Math.floor(index / 9) % 9 !== 8
            ? `2px solid ${colors.black1}`
            : Math.floor(index / 9) % 9 === 8
            ? `5px solid ${colors.black1}`
            : ""
        }`,
        backgroundColor: isChanged
          ? `${colors.highlightCell}`
          : isTrigger
          ? `${colors.triggerCell}`
          : "",
        color: fixed ? `${colors.black1}` : "",
        cursor: "pointer",
      }}
    >
      {value ? (
        value
      ) : (
        <div className="corner-marks">
          <CornerMarks
            values={possibilities
              .sort()
              .slice(0, Math.ceil(possibilities.length / 2))}
            row="top"
          />
          <CornerMarks
            values={possibilities
              .sort()
              .slice(Math.ceil(possibilities.length / 2))}
            row="bottom"
          />
        </div>
      )}
    </div>
  )
}
