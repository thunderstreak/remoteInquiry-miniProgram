import type { AnyType } from '@/@type'
import Taro from '@tarojs/taro'

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
