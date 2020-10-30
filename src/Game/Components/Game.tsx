import React from "react"

import Grid from "./Grid"
import {
  GameStateProvider,
  useGameActions,
  useGameState,
} from "../context/GameStateContext"
import { Cells } from "../types"

import "../scss/index.scss"

interface Props {
  initialCells: Cells
}

const Game = () => {
  const {
    clearSelected,
    checkCells,
    clearErrors,
    clearMessage,
  } = useGameActions()
  const { message } = useGameState()

  return (
    <div>
      <div id="game">
        <div
          className="click-off"
          onClick={e => {
            e.preventDefault()
            clearSelected()
          }}
        />
        <Grid />
        <button onClick={checkCells}>Check</button>
        <button
          onClick={() => {
            clearErrors()
            clearMessage()
          }}
        >
          Clear Errors
        </button>
        {message && (
          <div className="message" style={{ fontSize: "1.3rem" }}>
            {message}
          </div>
        )}
      </div>
    </div>
  )
}

export default ({ initialCells }: Props) => (
  <GameStateProvider initialCells={initialCells}>
    <Game />
  </GameStateProvider>
)
