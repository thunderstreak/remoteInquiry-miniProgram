export interface IConfig {
  baseURL: string;
  DEFAULT_EXTID: string;
  DEFAULT_APPID: string;
  DEFAULT_SERVER: string;
}

const config: IConfig = {
  baseURL: process.env.TARO_APP_API, // api地址
  /**
   * 企业ID
   */
  DEFAULT_EXTID: '281cd343dbc002706705b88f319143dea6d84f64',

  /**
   * 小鱼应用ID
   */
  DEFAULT_APPID: 'PPxv2plr2QqlnUHmRbxnvxd6',

  /**
   * 小程序SDK默认服务器地址
   */
  DEFAULT_SERVER: 'wxrtc.xylink.com'
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
