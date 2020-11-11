import React, { Component } from "react"
import { Givens } from "../../../Game"

import { ControlProps } from "../types"

type ControlState = {
  givens: Map<number, number>
  selected: Set<number>
  multiSelect: boolean
}

const colors = {
  black1: "#999",
  black2: "#ccc",
  black3: "#eee",
  blue1: "rgb(13, 87, 197)",
}

export default class SudokuControl extends Component<
  ControlProps<string>,
  ControlState
> {
  constructor(props: ControlProps<string>) {
    super(props)
    const givens = new Map()

    if (props.value) {
      const _givens: Givens = JSON.parse(props.value)
      _givens.forEach((given: any) => {
        givens.set(given.index, given.value)
      })
    }

    this.state = {
      givens,
      selected: new Set(),
      multiSelect: false,
    }
  }

  addValue = (val: number) => {
    const newGivens = new Map(this.state.givens)
    this.state.selected.forEach(index => {
      if (newGivens.has(index)) {
        newGivens.delete(index)
      } else {
        newGivens.set(index, val)
      }
    })

    this.setState({ givens: newGivens })
    this.update(newGivens)
  }

  deleteValue = () => {
    const newGivens = new Map(this.state.givens)
    this.state.selected.forEach(index => {
      newGivens.delete(index)
    })

    this.setState({ givens: newGivens })
    this.update(newGivens)
  }

  clearValues = () => {
    const newGivens = new Map(this.state.givens)
    newGivens.clear()

    this.setState({ givens: newGivens })
    this.update(newGivens)
  }

  update = (givens = this.state.givens) => {
    const _givens = Array.from(givens.entries()).map(([index, value]) => ({
      index,
      value,
    }))

    this.props.onChange(JSON.stringify(_givens))
  }

  toggleSelected = (i: number) => {
    const newSelected = new Set(this.state.selected)

    if (this.state.multiSelect) {
      newSelected.has(i) ? newSelected.delete(i) : newSelected.add(i)
    } else {
      if (newSelected.has(i)) {
        newSelected.clear()
      } else {
        newSelected.clear()
        newSelected.add(i)
      }
    }

    this.setState({ selected: newSelected })
  }

  handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Control") {
      this.setState({ multiSelect: true })
    }

    if (["Delete", "Backspace"].includes(e.key)) {
      this.deleteValue()
    }

    const digit = Number(e.key)
    if (digit && digit > 0 && digit <= 9) {
      this.addValue(digit)
    }
  }

  handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === "Control") {
      this.setState({ multiSelect: false })
    }
  }

  componentDidMount() {
    document.addEventListener("keydown", this.handleKeyDown)
    document.addEventListener("keyup", this.handleKeyUp)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.handleKeyDown)
    document.removeEventListener("keyup", this.handleKeyUp)
  }

  render() {
    return (
      <div style={{ padding: "1rem" }}>
        <button style={{ margin: "1rem 0" }} onClick={this.clearValues}>
          clear
        </button>
        <div
          style={{
            width: "30rem",
            height: "30rem",
            display: "grid",
            grid: "repeat(9, 1fr) / repeat(9, 1fr)",
            boxSizing: "border-box",
          }}
        >
          {Array(81)
            .fill(0)
            .map((_, i) => (
              <div
                style={{
                  fontSize: "2rem",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: colors.blue1,
                  cursor: "pointer",
                  backgroundColor: `${
                    this.state.selected.has(i) ? colors.black3 : ""
                  }`,
                  borderLeft: `${
                    i % 9 === 0
                      ? `5px solid ${colors.black1}`
                      : `1px solid ${colors.black2}`
                  }`,
                  borderRight: `${
                    i % 3 === 2 && i % 9 !== 8
                      ? `2px solid ${colors.black1}`
                      : i % 9 === 8
                      ? `5px solid ${colors.black1}`
                      : `1px solid ${colors.black2}`
                  }`,
                  borderTop: `${
                    Math.floor(i / 9) % 9 === 0
                      ? `5px solid ${colors.black1}`
                      : `1px solid ${colors.black2}`
                  }`,
                  borderBottom: `${
                    Math.floor(i / 9) % 3 === 2 && Math.floor(i / 9) % 9 !== 8
                      ? `2px solid ${colors.black1}`
                      : Math.floor(i / 9) % 9 === 8
                      ? `5px solid ${colors.black1}`
                      : `1px solid ${colors.black2}`
                  }`,
                }}
                className="cell"
                key={i}
                onClick={e => {
                  e.preventDefault()
                  this.toggleSelected(i)
                }}
              >
                {this.state.givens.get(i)}
              </div>
            ))}
        </div>
      </div>
    )
  }
}
