import React from "react"

interface Props {
  title?: string
}

export default ({ title }: Props) => {
  return (
    <div id="header">
      <h1>{title ? title : "Header"}</h1>
    </div>
  )
}
