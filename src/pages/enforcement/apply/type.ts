/**
 * 录入执法案件
 */
export interface FormData {
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
