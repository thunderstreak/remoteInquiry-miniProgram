export interface Login {
  /**
   * 小程序ID
   */
  appId: string;
  /**
   * 手机凭证
   */
  code: string;
  /**
   * 助力/转赠分享token，用于处理邀请逻辑
   */
  shareToken?: string;
}

export interface PageRewardRecord {
  pageNum?: number;
  pageSize?: number;
  /**
   * 任务编号
   */
  taskNo?: string;
}
