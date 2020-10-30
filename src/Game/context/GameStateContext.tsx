import React, {
  useState,
  useContext,
  useEffect,
  createContext,
  useCallback,
} from "react"
import { copyCell, hotKeys, checker } from "../utils"
import { CellData, Cells } from "../types"
import { useHistory, useSelection } from "../hooks"

interface GameState {
  cells: CellData[]
  selecting: boolean
  selected: Set<number>
  message: string
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
}

const defaultState: GameState = {
  cells: [],
  selecting: false,
  selected: new Set(),
  message: "",
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
}

const GameStateContext = createContext<GameState>(defaultState)
const GameActionsContext = createContext<Actions>(defaultActions)

//===================================================================================

export const GameStateProvider = ({
  children,
  initialCells,
}: {
  children: JSX.Element
  initialCells: Cells
}) => {
  const [message, setMessage] = useState<string>("")
  const [currentCells, history] = useHistory(initialCells)
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
      e.preventDefault()
      if (hotKeys.isDelete(e)) {
        deleteValue()
      }
      if (hotKeys.isCenterDelete(e)) {
        clearCenterMarks()
      }
      if (hotKeys.isCornerDelete(e)) {
        clearCornerMarks()
      }
      if (hotKeys.isAddValue(e)) {
        insertValue(hotKeys.getValue(e))
      }
      if (hotKeys.isAddCenterValue(e)) {
        toggleCenterMark(hotKeys.getValue(e))
      }
      if (hotKeys.isAddCornerValue(e)) {
        toggleCornerMark(hotKeys.getValue(e))
      }
      if (hotKeys.isMultiSelect(e)) {
        setMultiSelect(true)
      }
      if (hotKeys.isMove(e)) {
        moveCursor(e)
      }
      if (hotKeys.isUndo(e)) {
        history.undo()
      }
      if (hotKeys.isRedo(e)) {
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
      setMessage("Bingo!")
    } else {
      setMessage("That doesn't look right!")
    }
  }, [currentCells])

  //==================================================

  return (
    <GameStateContext.Provider
      value={{
        cells: currentCells,
        selecting,
        selected,
        message,
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
        }}
      >
        {children}
      </GameActionsContext.Provider>
    </GameStateContext.Provider>
  )
}

export const useGameState = (): GameState => useContext(GameStateContext)
export const useGameActions = (): Actions => useContext(GameActionsContext)
