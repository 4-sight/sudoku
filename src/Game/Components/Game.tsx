import React, { useCallback, useState } from "react"

import Grid from "./Grid"
import Timer from "./Timer"
import {
  GameStateProvider,
  useGameActions,
  useGameState,
} from "../context/GameStateContext"

import "../scss/index.scss"
import { SudokuProps } from "../types"

const Game = () => {
  const {
    clearSelected,
    checkCells,
    clearErrors,
    clearMessage,
    playFromHere,
  } = useGameActions()
  const { message, isSolved, solution } = useGameState()
  const [showSolution, setShowSolution] = useState<boolean>(false)
  const [walkThrough, setWalkThrough] = useState<boolean>(false)
  const [solutionStepIndex, setSolutionStepIndex] = useState<number>(0)

  const nextStep = useCallback(() => {
    solution &&
      setSolutionStepIndex(Math.min(solutionStepIndex + 1, solution.length - 1))
  }, [solutionStepIndex, solution])

  const prevStep = useCallback(() => {
    solution && setSolutionStepIndex(Math.max(solutionStepIndex - 1, 0))
  }, [solutionStepIndex, solution])

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
        <div className="top-section">
          <Timer />
        </div>
        <div className="mid-section">
          <Grid
            showSolution={showSolution && isSolved !== "solving"}
            walkThrough={walkThrough && isSolved !== "solving"}
            solutionStep={solution && solution[solutionStepIndex]}
          />
          {walkThrough && solution && (
            <div id="step-details">
              Action: {solution[solutionStepIndex].action}
              <br />
              {solution[solutionStepIndex].actionValues && (
                <>
                  Values: {solution[solutionStepIndex].actionValues?.join(",")}
                  <br />
                </>
              )}
              Reason: {solution[solutionStepIndex].strategy}
            </div>
          )}
        </div>
        <div id="base-section">
          {walkThrough ? (
            <>
              <button
                onClick={() => {
                  setWalkThrough(false)
                }}
              >
                {"End walkThrough"}
              </button>
              <button onClick={nextStep}>Next Step</button>
              <button onClick={prevStep}>PrevStep</button>
              <button
                onClick={() => {
                  setWalkThrough(false)
                  playFromHere(solution![solutionStepIndex].cells)
                }}
              >
                Play from here
              </button>
            </>
          ) : (
            <>
              <button onClick={checkCells}>Check</button>
              <button
                onClick={() => {
                  setShowSolution(!showSolution)
                }}
              >
                {showSolution ? "Hide solution" : "Show solution"}
              </button>
              <button
                onClick={() => {
                  setWalkThrough(true)
                  setSolutionStepIndex(0)
                }}
              >
                {"Start walkThrough"}
              </button>
              <button
                onClick={() => {
                  clearErrors()
                  clearMessage()
                }}
              >
                Clear Errors
              </button>
              {showSolution ? (
                <div className="message" style={{ fontSize: "1.3rem" }}>
                  {isSolved}
                </div>
              ) : (
                message && (
                  <div className="message" style={{ fontSize: "1.3rem" }}>
                    {message}
                  </div>
                )
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default (props: SudokuProps) => (
  <GameStateProvider {...props}>
    <Game />
  </GameStateProvider>
)
