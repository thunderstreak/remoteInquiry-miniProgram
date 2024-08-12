import { wrapperGet } from '@/config/request'
import type * as Res from '@/@type/response'
import type * as Com from '@/@type/common'

class HomeApi {
  /*
   * 小程序banner接口
   * */
  listBanners = wrapperGet<null, Com.ResponseData<Res.ListBanners[]>>(
    '/api/client-ubq-app/miniApp/listBanners'
  )
}

export default new HomeApi()
