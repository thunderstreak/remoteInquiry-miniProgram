export interface Login {
  userName: string;
  cardNo: string;
  deviceInfo?: string;
  /** 业务类型（0:公安，1:交警） */
  busType?: number;
  /** 登录类型（0:身份证，1:账号+密码，2:短信） */
  loginType?: number;
}

export interface RoomQueryRoomList {
  userName: string;
  cardNo: string;
}

export interface FingerPrint {
  fingerUrl: string
}

export interface UpdateFingerUrl extends FingerPrint{
  lawPeopleRecordNumId: string
}

export interface CardOcr{
  cardUrl: string
}

/**
 * 字典类型
 * @type {string}
 */
export interface Dict {
  type: string;
}

export interface GetUserListReq {
  /** 0:游客，1:辅警，2:民警 */
  type?: number;
  // 真实姓名
  userName: string;
}
