import { wrapperGet } from '@/config/request'
import type * as Req from '@/@type/request'
import type * as Res from '@/@type/response'
import type * as Com from '@/@type/common'

class HomeApi {
  /*
   * 获取可以登录的取证室
   * */
  roomQueryRoomList = wrapperGet<
    Req.RoomQueryRoomList,
    Com.ResponseData<Res.RoomQueryRoomList[]>
  >('/api/v1/room/queryRoomList')
}

export default new HomeApi()
