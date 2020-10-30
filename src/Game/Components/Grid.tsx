import React from "react"

import { useGameActions, useGameState } from "../context/GameStateContext"
import Cell from "./Cell"

export default () => {
  const { setSelecting } = useGameActions()
  const { cells, selected } = useGameState()

  return (
    <div
      id="grid"
      onMouseDown={e => {
        e.preventDefault()
        setSelecting(true)
      }}
      onMouseUp={e => {
        e.preventDefault()
        setSelecting(false)
      }}
    >
      {cells.map((data, i) => (
        <Cell data={data} key={i} isSelected={selected.has(i)} />
      ))}
    </div>
  )
}
