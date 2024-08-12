import Taro from '@tarojs/taro'
import { useEffect, useState } from 'react'

const createMenuButtonBounding = () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 })
export const useStatusHeight = () => {
  const [state, setState] = useState({
    statusBarHeight: 0,
    safeHeight: 0,
    screenHeight: 0,
    windowHeight: 0,
    menuButtonBounding: createMenuButtonBounding()
  })

  useEffect(() => {
    if (Taro.getEnv() === 'WEAPP') {
      const menuButtonBounding = Taro.getMenuButtonBoundingClientRect()
      const { statusBarHeight = 0, safeArea, screenHeight } = Taro.getWindowInfo()
      const safeHeight = screenHeight - (safeArea?.bottom ?? 0)

      setState((x) => ({ ...x, statusBarHeight, screenHeight, safeHeight, menuButtonBounding }))
    }
  }, [])

  return state
}
