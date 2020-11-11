import GridArea, { Area } from "./GridArea"

export default class GridAreaGroup {
  areas: GridArea[]

  constructor(type: Area) {
    this.areas = Array(9)
      .fill(null)
      .map((_, i) => new GridArea(i, type))
  }

  get = (i: number) => {
    return this.areas[i]
  }
}
