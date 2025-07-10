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

/**
 * 录入执法案件
 */
export interface InsertLawPoliceReq {
  /** 案由 */
  title: string;
  /** 违法地点 */
  lawAddress: string;
  /** 经度 */
  longitude: string;
  /** 纬度 */
  latitude: string;
  /** 违法类型 */
  lawType: string;
  /** 违法行为 */
  lawBehavior: string;
  /** 参与人（协辅警），多个以逗号隔开 */
  joinPeople: string;
  /** 备注 */
  remark: string;
  /** 当事人姓名 */
  partiesName: string;
  /** 当事人身份证号 */
  partiesCard: string;
  /** 当事人电话 */
  partiesPhone: string;
  /** 取证室 */
  roomCode: string;
  /** 房间密码 */
  roomPassword: string;
  /** 违法时间 */
  lawDate: string;
  [key: string]: any;
}
