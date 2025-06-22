/** 0-准备、1-呼叫中、2-已接听、3-办结（结束案件/录屏）、4-未接听（小程序3分钟内未接听）、5-取消呼叫、9-拒绝（3、4、5、9表示当次执法完成） */
export enum CallStatus {
  /** 未呼叫 */
  NOT_CALL = 0,
  /** 呼叫中 */
  CALLING = 1,
  /** 已接听 */
  CALLED = 2,
  /** 办结 */
  ANSWERED = 3,
  /** 未接听 */
  HUNG_UP = 4,
  /** 已取消 */
  CANCELLED = 5,
  /** 已拒绝 */
  CALL_FAILED = 9,
}

export interface ProxyViewProps {
  id: string
}
