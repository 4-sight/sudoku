import React from "react"

interface Props {
  values: number[]
  row: "top" | "bottom"
}

export default ({ values, row }: Props) => {
  return (
    <div className={`row ${row}-row`}>
      {values.map(n => (
        <div className="corner-mark" key={n}>
          {n}
        </div>
      ))}
    </div>
  )
}
