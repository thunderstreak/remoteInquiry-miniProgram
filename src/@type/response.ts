export interface VenueInfo {
  /**
   * 地址
   */
  address: string;
  /**
   * 纬度
   */
  latitude: string;
  /**
   * 经度
   */
  longitude: string;
  showImg: null;
}

/**
 * 活动状态
 * "DRAFT","草稿"
 * "NOT_STARTED","未开始"
 * "ENROLLING","报名中"
 * "CANCEL","已取消"
 * "CLOSE","已关闭"
 * "ENDED","已完成"
 * "ACT_END","已结束"
 */
export type ActStatus =
  | 'DRAFT'
  | 'NOT_STARTED'
  | 'ENROLLING'
  | 'CANCEL'
  | 'CLOSE'
  | 'ENDED'
  | 'ACT_END';

export interface ActivityDetail {
  /**
   * 活动详情
   */
  actDetail: string;
  /**
   * 活动名称
   */
  actName: string;
  actNo: string;
  /**
   * 活动须知
   */
  actNotice: string;
  /**
   * 封面图
   */
  actPoster: string[];
  /**
   * 活动状态
   */
  actStatus: ActStatus;
  /**
   * 活动列表名称
   */
  categoryName: string;
  /**
   * 活动类别id
   */
  categoryNo: string;
  /**
   * 免责声明
   */
  disclaimer: string;
  /**
   * 活动结束时间
   */
  endTime: number;
  /**
   * 报名结束时间
   */
  enrollEndTime: number;
  /**
   * 报名人数
   */
  enrollNum: number;
  /**
   * 报名开始时间
   */
  enrollStartTime: number;
  /**
   * 社群二维码
   */
  groupCode: string;
  /**
   * 是否报名
   */
  isEnroll: boolean;
  /**
   * 是否推荐
   */
  isRecommend: boolean;
  /**
   * 报名上限人数（无限制-1）
   */
  maxLimit: number;
  /**
   * 报名下限人数（无限制-1）
   */
  minLimit: number;
  /**
   * 价格
   */
  priceStr: string;
  /**
   * 报名单号
   */
  recordNo: string;
  /**
   * 退款截止时间
   */
  refundEndTime: number;
  /**
   * 剩余名额
   */
  residueNum: number;
  /**
   * 分享图
   */
  shareImg: string;
  /**
   * 活动开始时间
   */
  startTime: number;
  /**
   * 用户头像
   */
  userPicList: string[];
  /**
   * 地址
   */
  venueInfo: VenueInfo;
  /*
   * 是否需要申请信息
   * */
  isEnrollFrom: boolean;
}

export interface ActivityTickets {
  actNo: string;
  description: null;
  gmtCreate: null;
  /**
   * 占用人数
   */
  occupyNum: number;
  /**
   * 价格，免费  0
   */
  price: number;
  /**
   * 已售数量
   */
  sellQuantity: number;
  singleLimitNum: null;
  ticketName: string;
  ticketNo: string;
  /**
   * 剩余库存
   */
  totalRealStock: number;
  /**
   * 总库存，无限制-1
   */
  totalStock: number;
}

export interface LoginInfo {
  avatar?: string;
  domainName?: string;
  fuYouWalletStatus?: number;
  realNameAuth?: boolean;
  registTime?: number;
  source?: string;
  token: string;
  userId?: string;
}

export interface UserInfo {
  /**
   * 用户id,昵称,头像,手机号
   */
  userId: string;
  nickName: string;
  avatar: string;
  userMobile: string;
  /**
   * 用户性别 M(男) or F(女)
   */
  sex: string;
  /**
   * 是否核销员 是:true， 否:false
   */
  verifyAuth: boolean;
}

export interface ListBanners {
  id: number;
  platform: string;
  source: string;
  scene: string;
  name: string;
  path: string;
  jumpHref: string;
  sort: number;
  display: number;
  isDel: number;
  createId: string;
  createName: null | string;
  extInfo: string;
  gmtCreate: number;
  gmtModify: number;
  clientImg: string;
}

export interface MaterialList {
  /**
   * 图片
   */
  coverImg: string;
  /**
   * 材料编号
   */
  materialNo: string;
  /**
   * 材料名称
   */
  name: string;
  /**
   * 用户收集材料数量
   */
  userMaterialNum: number;
}

export interface TaskList {
  /**
   * 结束时间
   */
  deadline: number;
  /**
   * 任务说明
   */
  describe: string;
  /**
   * 材料列表
   */
  materialList: MaterialList[];
  /**
   * 任务名称
   */
  name: string;
  /**
   * 规则介绍
   */
  ruleIntroduction: string;
  /**
   * 展示图
   */
  showImg: string;
  /**
   * 开始时间
   */
  startTime: number;
  /**
   * 状态
   */
  status: string;
  /**
   * 任务编号
   */
  taskNo: string;
  /**
   * 总共材料
   */
  totalMaterialNum: number;
  /**
   * 任务类型
   */
  type: string;
  /**
   * 用户收集材料数
   */
  userMaterialNum: number;
}

/**
 * 奖励组列表
 */

export interface PageRewardRecord {
  /**
   * nfr编号
   */
  auctionNo?: string;
  /**
   * 展示图
   */
  coverImg?: string;
  /**
   * nfr名称
   */
  nfrName?: string;
  /**
   * 奖励时间，奖励时间
   */
  rewardTime?: string;
  /**
   * 链上地址
   */
  serialNum?: string;
}

export interface AssetList {
  /**
   * 资产数量
   */
  assetNum: number;
  /**
   * 图片
   */
  coverImg: string;
  /**
   * nfr名称
   */
  metaProductName: string;
  /**
   * 编号
   */
  metaProductNo: string;
}

export interface GetUserAssetList {
  /**
   * 资产列表
   */
  assetList: AssetList[];
  /**
   * 活动名称
   */
  taskName: string;
  taskNo: string;
  /**
   * 总共数量
   */
  totalNum: number;
}

export interface CheckGiftToken {
  /**
   * 展示图
   */
  coverImg: string;
  /**
   * NFR名称
   */
  name: string;
}
