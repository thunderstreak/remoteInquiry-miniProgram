import type { ResponseData, ResponseList } from '@/@type/common'
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import Taro from '@tarojs/taro'
import { filterCodes } from '@/config/index'
import { userActions } from '@/store/slice/user'

type Interceptors = ResponseData | ResponseList<undefined>;
const handleResponseData = async (response: AxiosResponse) => {
  const { data } = response
  const { code, message } = data as Interceptors
  switch (code) {
    case 4200: // 登录失效
      userActions.removeUserInfo()
      Taro.clearStorageSync()
      await Taro.navigateTo({ url: '/pages/login/index' })
      break
  }
  // 过滤特定错误类型
  if (filterCodes.includes(code)) {
    return Promise.reject(data)
  }
  // 错误提示
  if (code !== 200 && message) {
    await Taro.showToast({ title: message, icon: 'none', duration: 3000 })
    return Promise.reject(data)
  }
  return Promise.resolve(data)
}

export const requestConfigInterceptors = (
  config: InternalAxiosRequestConfig
) => {
  const token = Taro.getStorageSync('userInfo').token

  if (token) {
    config.headers.token = token
  }
  config.headers.tenantCode = 'ZY001'
  config.headers.orgCode = 'Z01'

  return config
}

export const requestErrorInterceptors = (error: AxiosError) => {
  return Promise.reject(error)
}

export const responseDataInterceptors = (response: AxiosResponse) => {
  const { status } = response

  switch (status) {
    case 200:
      return handleResponseData(response)
    default:
      return Promise.reject(response)
  }
}

export const responseErrorInterceptors = async (error: AxiosError) => {
  const { message, code } = error
  // 过滤指定错误类型和接口返回的错误提示
  if (code || message) {
    await Taro.showToast({ title: message, icon: 'none', duration: 3000 })
  }
  return Promise.reject(error)
}
