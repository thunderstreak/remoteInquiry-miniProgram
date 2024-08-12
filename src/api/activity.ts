import { wrapperGet } from '@/config/request'
import type * as Res from '@/@type/response'
import type * as Com from '@/@type/common'

class ActivityApi {
  /*
   * 小程序我的资产列表
   * */
  getUserAssetList = wrapperGet<
    {
      pageNum: number;
      pageSize: number;
    },
    Com.ResponseList<Res.GetUserAssetList>
  >('/api/client-ubq-app/miniApp/getUserAssetList')
}

export default new ActivityApi()
