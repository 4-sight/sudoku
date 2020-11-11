import React from "react"

import { useGameActions, useGameState } from "../context/GameStateContext"
import { GridState } from "../utils/solver/Classes/Grid"
import Cell from "./Cell"
import WalkThroughCell from "./WalkThroughCell"

interface Props {
  showSolution: boolean
  walkThrough: boolean
  solutionStep: GridState | null
}

export default ({ showSolution, walkThrough, solutionStep }: Props) => {
  const { setSelecting } = useGameActions()
  const { cells, selected } = useGameState()

  return (
    <div
      id="grid"
      onMouseDown={e => {
        if (!showSolution || !walkThrough) {
          e.preventDefault()
          setSelecting(true)
        }
      }}
      onMouseUp={e => {
        if (!showSolution || !walkThrough) {
          e.preventDefault()
          setSelecting(false)
        }
      }}
      onMouseLeave={e => {
        if (!showSolution || !walkThrough) {
          e.preventDefault()
          setSelecting(false)
        }
      }}
    >
      {walkThrough
        ? solutionStep?.cells.map(({ value, possibilities, fixed }, i) => (
            <WalkThroughCell
              isChanged={solutionStep.changedCell === i}
              value={value}
              possibilities={possibilities}
              fixed={fixed}
              index={i}
              key={i}
              isTrigger={solutionStep.triggers.includes(i)}
            />
          ))
        : cells.map((data, i) => (
            <Cell
              data={data}
              key={i}
              isSelected={selected.has(i)}
              showSolution={showSolution}
            />
          ))}
    </div>
  )
}
