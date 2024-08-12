import axios from 'axios'
import config from './index'
import {
  requestConfigInterceptors,
  requestErrorInterceptors,
  responseDataInterceptors,
  responseErrorInterceptors
} from './interceptors'

const { baseURL } = config
const service = axios.create({ timeout: 100000, baseURL })
/*
 * set request interceptor
 * */
service.interceptors.request.use(
  requestConfigInterceptors,
  requestErrorInterceptors
)

/*
 * set response interceptor
 * */
service.interceptors.response.use(
  responseDataInterceptors,
  responseErrorInterceptors
)

export default service
