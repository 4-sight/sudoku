import isHotKey from "is-hotkey"
import { HOTKEYS } from "../constants"

var IS_MAC =
  typeof window != "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(window.navigator.platform)

export const getValue = (e: KeyboardEvent): number =>
  Number(e.code[e.code.length - 1])

export const isUndo = isHotKey(HOTKEYS.UNDO)
export const isRedo = isHotKey(HOTKEYS.REDO)
export const isCenterDelete = isHotKey(HOTKEYS.CENTER_DELETE)
export const isCornerDelete = isHotKey(HOTKEYS.CORNER_DELETE)
export const isDelete = isHotKey(HOTKEYS.DELETE)
export const isAddValue = isHotKey(HOTKEYS.ADD_VALUE, { byKey: true })
export const isAddCenterValue = isHotKey(HOTKEYS.ADD_CENTER_VALUE, {
  byKey: true,
})

export const isAddCornerValue = (e: KeyboardEvent) => {
  return (
    isHotKey(HOTKEYS.ADD_CORNER_VALUE)(e) ||
    (e.location === 3 && HOTKEYS.ADD_CORNER_VALUE_NUMPAD.includes(e.key))
  )
}

export const isMultiSelect = (e: KeyboardEvent) => {
  if (e.key === "Control" || (IS_MAC && e.key === "meta")) {
    return true
  }
  return false
}

export const isMove = (e: KeyboardEvent) => {
  return (
    isHotKey(HOTKEYS.MOVE_KEYS)(e) ||
    (e.location === 0 && HOTKEYS.ARROW_KEYS.includes(e.key))
  )
}
