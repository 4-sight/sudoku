export interface ControlProps<T> {
  value: T | undefined
  onChange: (value: T) => void
  forID?: string
  classNameWrapper: string
  setActiveStyle: () => void
  setInactiveStyle: () => void
}
