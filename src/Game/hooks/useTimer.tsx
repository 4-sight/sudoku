import { useCallback, useEffect, useState } from "react"

interface Timer {
  time: string
  paused: boolean
  pause: () => void
  start: () => void
  reset: () => void
  stop: () => void
}

export default (): Timer => {
  const [elapsed, setElapsed] = useState<number>(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)
  const [isActive, setIsActive] = useState<boolean>(false)
  const [stopped, setStopped] = useState<boolean>(false)

  useEffect(() => {
    let interval: any
    if (!stopped) {
      if (isActive) {
        interval = setInterval(() => {
          setSeconds(Math.floor((Date.now() - startTime + elapsed) / 1000))
        }, 1000)
      } else {
        if (seconds !== 0) {
          clearInterval(interval)
        }
      }
    } else {
      clearInterval(interval)
    }

    return () => {
      clearInterval(interval)
    }
  }, [seconds, isActive, startTime])

  const parseTime = useCallback((secs: number) => {
    const seconds = secs % 60
    const minutes = Math.floor(secs / 60) % 60
    const hours = Math.floor(secs / 3600) % 60

    return `${hours < 10 ? "0" + hours : hours.toString()}:${
      minutes < 10 ? "0" + minutes : minutes.toString()
    }:${seconds < 10 ? "0" + seconds.toString() : seconds.toString()}`
  }, [])

  const pause = useCallback(() => {
    if (isActive) {
      setElapsed(elapsed + (Date.now() - startTime))
      setIsActive(false)
    } else {
      setStartTime(Date.now())
      setIsActive(true)
    }
  }, [isActive, elapsed, startTime])

  const start = useCallback(() => {
    setStartTime(Date.now())
    setIsActive(true)
  }, [])

  const stop = useCallback(() => {
    setStopped(true)
  }, [])

  const reset = useCallback(() => {
    setIsActive(false)
    setElapsed(0)
    setSeconds(0)
  }, [])

  return {
    time: parseTime(seconds),
    paused: !isActive,
    pause,
    start,
    stop,
    reset,
  }
}
