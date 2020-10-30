import { useState, useCallback } from "react"

interface Selection {
  selected: Set<number>
  selecting: boolean
  addToSelected: (i: number) => void
  replaceSelected: (i: number) => void
  clearSelected: () => void
  selectCell: (i: number) => void
  setMultiSelect: (val: boolean) => void
  setSelecting: (val: boolean) => void
}

export default (): Selection => {
  const [selected, setSelected] = useState<Set<number>>(new Set())
  const [selecting, setSelecting] = useState<boolean>(false)
  const [multiSelect, setMultiSelect] = useState<boolean>(false)

  const addSelected = useCallback(
    (i: number) => {
      selected.add(i)
      setSelected(new Set(selected))
    },
    [selected]
  )

  const replaceSelected = useCallback(
    (i: number) => {
      setSelected(new Set([i]))
    },
    [selected]
  )

  const deleteSelected = useCallback(
    (i: number) => {
      selected.delete(i)
      setSelected(new Set(selected))
    },
    [selected]
  )

  const clearSelected = useCallback(() => {
    selected.clear()
    setSelected(new Set(selected))
  }, [selected])

  const addToSelected = useCallback(
    (i: number) => {
      selected.add(i)
      setSelected(new Set(selected))
    },
    [selected]
  )

  const selectCell = useCallback(
    (index: number) => {
      if (multiSelect) {
        if (selected.has(index)) {
          // Deselect
          deleteSelected(index)
        } else {
          addSelected(index)
        }
      } else {
        // If multiple are selected - select clicked
        if (selected.size > 1) {
          replaceSelected(index)
        } else {
          if (selected.has(index)) {
            clearSelected()
          } else {
            replaceSelected(index)
          }
        }
      }
    },
    [selected, multiSelect]
  )

  return {
    selected,
    selecting,
    addToSelected,
    replaceSelected,
    clearSelected,
    selectCell,
    setMultiSelect,
    setSelecting,
  }
}
