import React from "react"

interface Props {
  values: number[]
}

export default ({ values }: Props) => {
  return <div className="center-marks">{values}</div>
}
