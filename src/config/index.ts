export interface IConfig {
  baseURL: string;
}

const config: IConfig = {
  baseURL: process.env.TARO_APP_API // api地址
}

/*
 * A00006: 链接失效
 * */
export const filterCodes: number[] = []

export const lightTheme = {
  // nutuiColorPrimary: '#3777E1'
  nutuiColorPrimaryStop1: '#3777E1',
  nutuiColorPrimaryStop2: '#3777E1'
}

export default config
