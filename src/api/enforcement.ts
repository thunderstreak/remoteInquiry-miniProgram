import { wrapperGet, wrapperPost } from "@/config/request";
import type * as Res from '@/@type/response'
import type * as Req from '@/@type/request'
import type * as Com from '@/@type/common'

class EnforcementApi {
  getUserList =wrapperPost<Req.GetUserListReq, Com.ResponseList<Res.GetUserListRes>>(
    "/api/v1/user/getUserList"
  );

  /**
   * 执法室列表
   */
  queryPoliceRoomList = wrapperPost<null, Com.ResponseList<Res.GetRoomListRes>>(
    "/api/v1/room/queryPoliceRoomList"
  );

  /**
   * 是否有正在办理的案件
   */
  queryLawPoliceNotColse = wrapperPost<null, Com.ResponseData<Res.GetEnforcementStatusRes>>(
    "/api/v1/lawPolice/queryLawPoliceNotColse"
  );

  /**
   * 录入案件
   */
  insertLawPolice = wrapperPost<Req.InsertLawPoliceReq, Com.ResponseData<any>>(
    "/api/v1/lawPolice/insert"
  );

  /**
   * 执法记录列表
   */
  queryLawPoliceList = wrapperPost<null, Com.ResponseList<Res.GetEnforcementStatusRes>>(
    "/api/v1/lawPolice/queryLawPoliceList"
  );

}

export default new EnforcementApi();
