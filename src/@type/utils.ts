/*
 * 将指定属性转换成string
 * */
export type ConvertToString<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> & Record<K, string>
export type ConvertToBoolean<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>> &
  Record<K, boolean>

// 获取泛型函数中泛型的类型
export type GetGenericType<T> = T extends (arg: infer P) => any ? P : never
