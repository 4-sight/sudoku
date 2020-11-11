import React, { useEffect } from "react"
import { useGameState, useGameActions } from "../context/GameStateContext"

export default () => {
  const { time, isPaused } = useGameState()
  const { startTimer, pauseTimer, resetTimer } = useGameActions()
  useEffect(startTimer, [])

  return (
    <div className="timer">
      <button onClick={pauseTimer}>{isPaused ? "start" : "pause"}</button>
      <button onClick={resetTimer}>reset</button>
      {time}
    </div>
  )
}
