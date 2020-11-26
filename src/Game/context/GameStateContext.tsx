import React, {
  useState,
  useContext,
  useEffect,
  createContext,
  useCallback,
} from "react"
import { copyCell, hotKeys, checker, solver } from "../utils"
import { CellData, SudokuProps } from "../types"
import { useHistory, useSelection, useTimer } from "../hooks"
import { CellState, GridState, Solution } from "../utils/solver/Classes/Grid"

interface Props extends SudokuProps {
  children: JSX.Element
}

type SolveState = "solving" | "solved" | "failed"

interface GameState {
  cells: CellData[]
  selecting: boolean
  selected: Set<number>
  message: string
  time: string
  isPaused: boolean
  isSolved: SolveState
  solution: null | Solution
}

interface Actions {
  setSelecting: (val: boolean) => void
  selectCell: (i: number) => void
  addToSelected: (i: number) => void
  setMultiSelect: (val: boolean) => void
  clearSelected: () => void
  checkCells: () => void
  clearErrors: () => void
  clearMessage: () => void
  startTimer: () => void
  stopTimer: () => void
  pauseTimer: () => void
  resetTimer: () => void
  playFromHere: (cells: CellState[]) => void
}

const defaultState: GameState = {
  cells: [],
  selecting: false,
  selected: new Set(),
  message: "",
  time: "",
  isPaused: false,
  isSolved: "solving",
  solution: null,
}

const defaultActions: Actions = {
  setSelecting: () => {},
  selectCell: () => {},
  addToSelected: () => {},
  setMultiSelect: () => {},
  clearSelected: () => {},
  checkCells: () => {},
  clearErrors: () => {},
  clearMessage: () => {},
  startTimer: () => {},
  stopTimer: () => {},
  pauseTimer: () => {},
  resetTimer: () => {},
  playFromHere: () => {},
}

const GameStateContext = createContext<GameState>(defaultState)
const GameActionsContext = createContext<Actions>(defaultActions)

//===================================================================================

export const GameStateProvider = ({ children, givens }: Props) => {
  const [message, setMessage] = useState<string>("")
  const [currentCells, history] = useHistory(JSON.parse(givens))
  const [solution, setSolution] = useState<Solution | null>(null)
  const [isSolved, setIsSolved] = useState<SolveState>("solving")
  const {
    time,
    start: startTimer,
    stop: stopTimer,
    pause: pauseTimer,
    reset: resetTimer,
    paused: isPaused,
  } = useTimer()
  const {
    selected,
    selecting,
    addToSelected,
    replaceSelected,
    clearSelected,
    selectCell,
    setSelecting,
    setMultiSelect,
  } = useSelection()

  //=================================================
  // Get Solution

  useEffect(() => {
    const [solveHistory, solved] = solver(JSON.parse(givens))
    setSolution(solveHistory)
    setIsSolved(solved ? "solved" : "failed")
    const finished = solveHistory.slice(-1)[0]

    const newState = [...currentCells].map((cell, i) => {
      const { value, possibilities } = finished.cells[i]
      return {
        ...copyCell(cell),
        solution: {
          value,
          possibilities,
        },
      }
    })

    history.add(newState)
  }, [])

  //=================================================
  // Actions

  const moveCursor = useCallback(
    (e: KeyboardEvent) => {
      if (selected.size === 1) {
        const currentIndex = Array.from(selected.values())[0]
        switch (e.key) {
          case "w":
          case "ArrowUp":
            replaceSelected((currentIndex - 9 + 81) % 81)
            break
          case "s":
          case "ArrowDown":
            replaceSelected((currentIndex + 9 + 81) % 81)
            break
          case "a":
          case "ArrowLeft":
            replaceSelected((currentIndex - 1 + 81) % 81)
            break
          case "d":
          case "ArrowRight":
            replaceSelected((currentIndex + 1 + 81) % 81)
            break
        }
      }
    },
    [selected]
  )

  const updateCells = useCallback(
    (
      cb: (cell: CellData) => CellData,
      condition: (cell: CellData) => boolean = () => true
    ) => {
      let updated = false
      if (selected.size > 0) {
        const newCells = [...currentCells]
        selected.forEach(index => {
          const cell = newCells[index]
          if (!cell.fixed) {
            if (condition(cell)) {
              updated = true
              newCells[index] = cb(cell)
            }
          }
        })

        if (updated) {
          history.add(newCells)
        }
      }
    },
    [selected, currentCells]
  )

  // Message======================
  const clearMessage = useCallback(() => {
    setMessage("")
  }, [])

  // Errors=======================

  const clearErrors = useCallback(() => {
    history.add([...currentCells].map(cell => ({ ...cell, error: false })))
  }, [currentCells])

  // Values=======================
  const insertValue = useCallback(
    (value: number) => {
      updateCells(
        cell => ({ ...cell, value }),
        cell => cell.value !== value
      )
    },
    [updateCells]
  )

  const deleteValue = useCallback(() => {
    updateCells(
      cell => {
        const newCell = copyCell(cell)
        if (newCell.value) {
          newCell.value = null
        } else {
          newCell.corner.clear()
          newCell.center.clear()
        }

        return newCell
      },
      cell => !!cell.value || cell.center.size > 0 || cell.corner.size > 0
    )
  }, [updateCells])

  // Center marks====================
  const toggleCenterMark = useCallback(
    (mark: number) => {
      updateCells(cell => {
        const newCell = copyCell(cell)
        if (newCell.center.has(mark)) {
          newCell.center.delete(mark)
        } else {
          newCell.center.add(mark)
        }

        return newCell
      })
    },
    [updateCells]
  )

  const clearCenterMarks = useCallback(() => {
    updateCells(
      cell => {
        const newCell = copyCell(cell)
        newCell.center.clear()

        return newCell
      },
      cell => !!(cell.center.size > 0)
    )
  }, [updateCells])

  // Corner marks====================
  const toggleCornerMark = useCallback(
    (mark: number) => {
      updateCells(cell => {
        const newCell = copyCell(cell)
        if (newCell.corner.has(mark)) {
          newCell.corner.delete(mark)
        } else {
          newCell.corner.add(mark)
        }

        return newCell
      })
    },
    [updateCells]
  )

  const clearCornerMarks = useCallback(() => {
    updateCells(
      cell => {
        const newCell = copyCell(cell)
        newCell.corner.clear()

        return newCell
      },
      cell => !!(cell.corner.size > 0)
    )
  }, [updateCells])

  //=================================================
  // Key handling

  const handleKeydown = useCallback(
    (e: KeyboardEvent) => {
      if (hotKeys.isDelete(e)) {
        e.preventDefault()
        deleteValue()
      }
      if (hotKeys.isCenterDelete(e)) {
        e.preventDefault()
        clearCenterMarks()
      }
      if (hotKeys.isCornerDelete(e)) {
        e.preventDefault()
        clearCornerMarks()
      }
      if (hotKeys.isAddValue(e)) {
        e.preventDefault()
        insertValue(hotKeys.getValue(e))
      }
      if (hotKeys.isAddCenterValue(e)) {
        e.preventDefault()
        toggleCenterMark(hotKeys.getValue(e))
      }
      if (hotKeys.isAddCornerValue(e)) {
        e.preventDefault()
        toggleCornerMark(hotKeys.getValue(e))
      }
      if (hotKeys.isMultiSelect(e)) {
        e.preventDefault()
        setMultiSelect(true)
      }
      if (hotKeys.isMove(e)) {
        e.preventDefault()
        moveCursor(e)
      }
      if (hotKeys.isUndo(e)) {
        e.preventDefault()
        history.undo()
      }
      if (hotKeys.isRedo(e)) {
        e.preventDefault()
        history.redo()
      }
    },
    [insertValue, history.undo, history.redo]
  )

  const handleKeyup = useCallback((e: KeyboardEvent) => {
    e.preventDefault()
    if (hotKeys.isMultiSelect(e)) {
      setMultiSelect(false)
    }
  }, [])

  useEffect(() => {
    document.addEventListener("keydown", handleKeydown)
    document.addEventListener("keyup", handleKeyup)
    return () => {
      document.removeEventListener("keydown", handleKeydown)
      document.removeEventListener("keyup", handleKeyup)
    }
  }, [handleKeydown, handleKeyup])

  //==================================================

  const checkCells = useCallback(() => {
    clearErrors()
    setMessage("")
    clearSelected()

    const [newState, correct] = checker(currentCells)
    history.add(newState)
    if (correct) {
      stopTimer()
      setMessage("Bingo!")
    } else {
      setMessage("That doesn't look right!")
    }
  }, [currentCells])

  const playFromHere = useCallback((cells: CellState[]) => {
    history.reset()
    const currState: CellData[] = cells.map(
      ({ value, possibilities, fixed }, index) => ({
        value,
        fixed: fixed,
        row: Math.floor(index / 9) + 1,
        col: (index % 9) + 1,
        index: index,
        backgroundColor: "",
        corner: new Set(),
        center: new Set(possibilities),
        error: false,
        solution: null,
      })
    )
    history.add(currState)
  }, [])

  //==================================================

  return (
    <GameStateContext.Provider
      value={{
        cells: currentCells,
        selecting,
        selected,
        message,
        time,
        isPaused,
        isSolved,
        solution,
      }}
    >
      <GameActionsContext.Provider
        value={{
          setSelecting,
          selectCell,
          addToSelected,
          setMultiSelect,
          clearSelected,
          checkCells,
          clearErrors,
          clearMessage,
          startTimer,
          stopTimer,
          pauseTimer,
          resetTimer,
          playFromHere,
        }}
      >
        {children}
      </GameActionsContext.Provider>
    </GameStateContext.Provider>
  )
}

export const useGameState = (): GameState => useContext(GameStateContext)
export const useGameActions = (): Actions => useContext(GameActionsContext)
