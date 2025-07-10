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
   * 正在办理的案件
   */
  queryLawPoliceNotColse = wrapperPost<null, Com.ResponseData<Res.GetEnforcementStatusRes>>(
    "/api/v1/lawPolice/queryLawPoliceNotColse"
  );

  /**
   * 录入案件
   */
  insertLawPolice = wrapperPost<Req.InsertLawPoliceReq, Com.ResponseData<Res.GetEnforcementStatusRes>>(
    "/api/v1/lawPolice/insert"
  );

  /**
   * 执法记录列表
   */
  queryLawPoliceList = wrapperPost<null, Com.ResponseList<Res.GetEnforcementStatusRes>>(
    "/api/v1/lawPolice/queryLawPoliceList"
  );

  /**
   * 获取当前案件的呼叫状态
   */
  queryCallStatus = wrapperPost<{id: string}, Com.ResponseData<Res.GetEnforcementStatusRes>>(
    "/api/v1/lawPolice/getLawPoliceById"
  );

  /**
   * 超时未接通通知服务端
   */
  timeoutNotAcceptCall = wrapperPost<{id: string}, Com.ResponseData<any>>(
    "/api/v1/lawPolice/notAcceptCall"
  );

  /**
   * 取消呼叫
   */
  cancelCall = wrapperPost<{id: string}, Com.ResponseData<any>>(
    "/api/v1/lawPolice/exitCall"
  );

  /**
   * 挂断关闭执法通知
   */
  closeEnforcement = wrapperPost<{id: string}, Com.ResponseData<any>>(
    "/api/v1/lawPolice/closeCall"
  );
}

export default new EnforcementApi();
