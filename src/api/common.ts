import { wrapperPost } from '@/config/request'
import type * as Res from '@/@type/response'
import type * as Com from '@/@type/common'

class CommonApi {
  /*
   * 获取签字提示内容
   * */
  getSaasInfo = wrapperPost<null, Com.ResponseData<Res.GetSaasInfo>>(
    '/api/v1/saas/getSaasInfo'
  )
}

export default new CommonApi()
