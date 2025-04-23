import type { AnyType } from '@/@type'
import Taro from '@tarojs/taro'

export type MPFunction = (...args: any[]) => any;

interface EventClientParams {
  timeStamp: number;
}

export const Event = {
  lastTapTime: 0,
  lastTapTimer: null,
  click: function (
    params: EventClientParams,
    doubleClick?: MPFunction,
    singleClick?: MPFunction
  ) {
    const currentTime = params.timeStamp
    const lastTapTime = this.lastTapTime
    this.lastTapTime = currentTime

    if (currentTime - lastTapTime < 250) {
      this.lastTapTime = 0
      if (doubleClick) { doubleClick() }
      // @ts-ignore
      clearTimeout(this.lastTapTimer)
    } else {
      // @ts-ignore
      this.lastTapTimer = setTimeout(() => {
        this.lastTapTime = 0
        if (singleClick) { singleClick() }
      }, 250)
    }
  }
}

export const handleArrayToObject = (data: AnyType) =>
  data.reduce(
    (prev: { [x: string]: unknown }, curr: { [x: string]: unknown }) => {
      Object.keys(curr).forEach((x: string) => {
        prev[x] = curr[x]
      })
      return prev
    },
    {}
  )

export const parse = <T, U extends string>(attr: U, data: T): T => {
  const pathArray: string[] = attr.split('.')

  let result = data
  for (const prop of pathArray) {
    if (prop.includes('[') && prop.includes(']')) {
      const [arrProp, index] = prop.split('[')
      const arrIndex = parseInt(index.replace(']', ''))
      result = result[arrProp][arrIndex]
    } else {
      result = result[prop]
    }
  }
  return result
}

/*
 * px转换rpx
 * */
export const transformPxToRpx = (px: number) => {
  if (Taro.getEnv() === 'WEB') {
    return `${px}px`
  }
  return `${px * 2}rpx`
}

export const hiddenLoadingCatch = <T>(err: T) => {
  Taro.hideLoading()
  return err
}
