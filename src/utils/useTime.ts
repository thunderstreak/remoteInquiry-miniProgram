import { useEffect, useState } from 'react'

export const useTimer = (initialSeconds = 0, intervalDuration = 1000) => {
  const [seconds, setSeconds] = useState(initialSeconds)
  const [timerRunning, setTimerRunning] = useState(false)

  useEffect(() => {
    let intervalId: any = null

    if (timerRunning) {
      intervalId = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1)
      }, intervalDuration)
    }

    return () => {
      clearInterval(intervalId)
    }
  }, [timerRunning, intervalDuration])

  const startStopTimer = () => {
    setTimerRunning(!timerRunning)
  }

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
      .toString()
      .padStart(2, '0')}`
  }

  return { seconds, startStopTimer, timerRunning, formatTime }
}
