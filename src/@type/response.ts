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

export interface Login {
  id: string;
  tenantCode: string;
  orgCode: string;
  orgName: string;
  cardNo: string;
  userName: string;
  roomCode: string;
  roomPassword: string;
  isExpire: boolean;
  token: string;
  refreshToken: string | null;
}

export interface UserInfo extends Login {}

export interface RoomQueryRoomList {
  id: string;
  lawId: string;
  tenantCode: string;
  orgCode: string;
  isDelete: null | string;
  createBy: null | string;
  createName: null | string;
  createTime: null | string;
  updateBy: null | string;
  updateName: null | string;
  updateTime: null | string;
  lawCode: string;
  lawName: string;
  lawType: string;
  state: number;
  remark: string;
  userName: string;
  cardNo: string;
  roomCode: string;
  roomName: string;
  roomPassword: string;
  lawPeopleRecordNumId:string;
  isFinger: 0 | 1; // 是否指纹进入（0不需要，1需要）
  isFace: 0 | 1;// 是否需要人脸识别（0不需要，1需要） isFinger;
  fingerUrl: string;// 指纹地址（为空，表示指纹未上传）
  isShowFace: 0 | 1;// 是否调用人脸识别（0不调用，1调用） 根据isShowFace判断是否调用人脸，isShowFinger判断是否显示“去采集”
  isShowFinger: 0 | 1;// 是否显示指纹采集（0不显示，1显示）
}

export interface GetSaasInfo {
  orgCode: string
  tenantCode: string
  xwtzs_remark: string
}
export interface FingerPrint{}
export interface UpdateFingerUrl{}
export interface CardOcr{
  address: string
  birthDate: string
  ethnicity: string
  idNumber: string
  issueAuthority: string | null
  name: string
  sex: string
  validPeriod: string | null
}
