import { wrapperPost } from '@/config/request'

import type * as Req from '@/@type/request'
import type * as Res from '@/@type/response'
import type * as Com from '@/@type/common'

class LoginApi {
  /*
   * 微信快速登录
   * */
  login = wrapperPost<Req.Login, Com.ResponseData<Res.Login>>(
    '/api/v1/user/login'
  )
}

export default new LoginApi()
