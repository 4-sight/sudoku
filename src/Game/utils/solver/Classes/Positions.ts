import GridCell from "./GridCell"

export default class Positions extends Set<GridCell> {
  getFirst = (): GridCell => {
    return this.values().next().value
  }
  toArray = (): GridCell[] => {
    return Array.from(this.values())
  }
  containsAllOf = (other: Positions) =>
    !other.toArray().some(cell => !this.has(cell))

  containsOneOf = (other: Positions) =>
    other.toArray().some(cell => this.has(cell))
  matches = (other: Positions) =>
    other.size === this.size && this.containsAllOf(other)
}
