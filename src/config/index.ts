export interface ConfigHeaders {
  tenantCode: string
  orgCode: string
}

export enum PlatformTypes {
  '远程取证' = 'EVIDENCE',
  '交警云执法' = 'ENFORCE'
}
export interface IConfig {
  baseURL: string;
  headers: ConfigHeaders;
  DEFAULT_EXTID: string;
  DEFAULT_APPID: string;
  DEFAULT_SERVER: string;
  PLATFORM: PlatformTypes;
  ORG_CODE: string;
}


console.log(process.env.TARO_APP_PLATFORM, ' process.env.TARO_APP_PLATFORM')

/**
 * 平台类型
 */
const platform: PlatformTypes = process.env.TARO_APP_PLATFORM as PlatformTypes || PlatformTypes.远程取证

const orgCode = platform === PlatformTypes.交警云执法 ? 'Z02' : 'Hbp5J1'

const config: IConfig = {
  baseURL: process.env.TARO_APP_API, // api地址
  headers: { tenantCode: 'ZY001', orgCode: orgCode },
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
  DEFAULT_SERVER: 'wxrtc.xylink.com',

  /**
   * 平台类型
   */
  PLATFORM: platform,

  /**
   * 平台orgCode
   */
  ORG_CODE: orgCode,
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
