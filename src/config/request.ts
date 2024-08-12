import { handleArrayToObject } from '@/utils'
import { isArray, isObject } from 'lodash'
import type { RequestParams } from '@/@type'
import type { Method } from 'axios'
import service from './service'

const { get, post, put, postForm } = service

/**
 * 请求参数处理
 **/
const setData = <T = RequestParams>(
  data: T[] | RequestParams[]
): RequestParams | null => {
  if (!data.length) {
    return null
  }
  // first参数是Api在具体调用的时候传递的
  const [first, ...other] = data
  let temp: RequestParams = {}
  let params: RequestParams

  // 针对传入的额外扩展参数和header参数统一合并, other存在的时候一定是额外扩展参数
  if (other.length) {
    temp = handleArrayToObject(other)
    if (temp.extras) {
      temp.extras = handleArrayToObject(temp.extras)
    }
  }

  if (isArray(first)) {
    params = first.map((x) => ({ ...x, ...temp.extras }))
  } else if (isObject(first)) {
    params = { ...first, ...temp.extras }
  } else {
    params = { ...temp.extras }
  }
  return params
}

/*
 * 设置基本信息
 * */
const setConfig = <T>(data: T[], type: Method) => {
  const [params, ...other] = data
  const { headers = {}, config = {} } = handleArrayToObject(other)
  const result = { headers, ...config }
  switch (type) {
    case 'GET':
      result.params = params
      break
    case 'POST':
    case 'PUT':
      result.data = params
      break
    default:
      result.params = params
      break
  }
  return result
}

/**
 * GET 请求
 **/
export const wrapperGet =
  <T, R>(url: string) =>
  (...params: T[]) =>
    get<T, R>(url, setConfig(params, 'GET'))

/**
 * POST 请求
 **/
export const wrapperPost =
  <T, R>(url: string) =>
  (...data: T[]) =>
    post<T, R>(url, setData<T>(data), setConfig<T>(data, 'POST'))
/**
 * PUT 请求
 **/
export const wrapperPut =
  <T, R>(url: string) =>
  (...data: T[]) =>
    put<T, R>(url, setData<T>(data), setConfig<T>(data, 'PUT'))

/**
 * POST From 请求
 **/
export const wrapperPostForm =
  <T, R>(url: string) =>
  (...data: T[]) =>
    postForm<T, R>(url, setData<T>(data), setConfig<T>(data, 'POST'))

/**
 * POST Params 请求
 **/
export const wrapperPostParams =
  <T, R>(url: string) =>
  (...params: T[]) =>
    post<T, R>(url, null, setConfig<T>(params, 'POST'))
