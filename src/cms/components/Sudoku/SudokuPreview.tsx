import React from "react"
import { Givens } from "../../../Game"

const colors = {
  black1: "#999",
  black2: "#ccc",
  black3: "#eee",
  blue1: "rgb(13, 87, 197)",
}

export default (props: { value: string }) => {
  const cells = Array(81).fill(null)

  if (props.value) {
    const givens: Givens = JSON.parse(props.value)
    givens.forEach(({ index, value }) => {
      cells[index] = value
    })
  }

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          width: "30rem",
          height: "30rem",
          display: "grid",
          grid: "repeat(9, 1fr) / repeat(9, 1fr)",
          boxSizing: "border-box",
        }}
      >
        {cells.map((val, i) => (
          <div
            style={{
              fontSize: "2rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              color: colors.blue1,
              cursor: "pointer",
              borderLeft: `${
                i % 9 === 0
                  ? `5px solid ${colors.black1}`
                  : `1px solid ${colors.black2}`
              }`,
              borderRight: `${
                i % 3 === 2 && i % 9 !== 8
                  ? `2px solid ${colors.black1}`
                  : i % 9 === 8
                  ? `5px solid ${colors.black1}`
                  : `1px solid ${colors.black2}`
              }`,
              borderTop: `${
                Math.floor(i / 9) % 9 === 0
                  ? `5px solid ${colors.black1}`
                  : `1px solid ${colors.black2}`
              }`,
              borderBottom: `${
                Math.floor(i / 9) % 3 === 2 && Math.floor(i / 9) % 9 !== 8
                  ? `2px solid ${colors.black1}`
                  : Math.floor(i / 9) % 9 === 8
                  ? `5px solid ${colors.black1}`
                  : `1px solid ${colors.black2}`
              }`,
            }}
            className="cell"
            key={i}
          >
            {val}
          </div>
        ))}
      </div>
    </div>
  )
}
