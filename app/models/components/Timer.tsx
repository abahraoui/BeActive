import React, { useEffect, useRef, useState } from "react"
import { Text, TextProps } from "../../components"

type TimerProps = {
  duration: number
  onComplete: () => void
} & TextProps

function CountDownTimer(props: TimerProps) {
  const { duration, onComplete, ...textProps } = props

  const [time, setTime] = useState(duration)
  const timerRef = useRef(time)

  useEffect(() => {
    const timerId = setInterval(() => {
      timerRef.current -= 1
      if (timerRef.current < 0) {
        console.log("Timer Complete")
        if (typeof onComplete === "function") onComplete()
        clearInterval(timerId)
      } else {
        setTime(timerRef.current)
      }
    }, 1000)
    return () => {
      clearInterval(timerId)
    }
  }, [])

  return <Text text={`${time}`} {...textProps} />
}

export default CountDownTimer
