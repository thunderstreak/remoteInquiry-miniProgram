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
  /** 警号？ */
  loginCode: string;
  /** 所属执法队变化 --- 交警执法 */
  departmentName: string;
  /** 所属执法队 --- 交警执法 */
  departmentCode: string;
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
export interface OnNoticeData {
  time: number
  data?: Template
}
export interface Template {
  content: string
  contentInput: string
  createBy: string
  createName: string
  createTime: string
  dictCode: string
  dictName: string
  documentTypeName: string
  fingerUrl: string
  id: string
  isDelete: number
  isPut: string
  orgCode: string
  remark: string
  roomCode: string
  state: number
  templateCode: string
  templateName: string
  templateType: string
  templateTypeName: string
  tenantCode: string
  updateBy: string
  updateName: string
  updateTime: string
}

/**
 * 字典返回数据
 */
export interface DictOption {
  key: string
  value: string
}

/**
 * 用户信息
 */
export interface GetUserListRes extends Login {
  /** 是否启用 */
  isPut: 0 | 1;
  /** 第三方id(为空，默认值-1) */
  thirdId: string;
  /** 登录账号(为空，默认值-1) */
  loginCode: string;
  /** 盐 */
  salt: string;
  /** 密码 */
  password: string;
  /** 微信唯一open_id(为空，默认值-1) */
  openId: string;
  /** 微信小程序(为空，默认值-1) */
  chatOpenId: string;
  /** 手机号（个人中心维护，不作为用户登录手机号） */
  phone: string;
  /** 真实姓名 */
  userName: string;
  /** ip */
  ip: string;
  /** 昵称 */
  nickname: string;
  /** 头像 */
  headerImg: string;
  /** 签名 */
  description: string;
  /** 性别 */
  sex: number;
  /** 年龄 */
  age: number;
  /** 出生年月日 */
  birthday: string;
  /** 用户类型 2:民警 1:辅警 */
  type: string;
  /** 邀请码 */
  invitationCode: string;
  /** 是否允许被其他用户查找 0-否 1-是 */
  allowFind: number;
  /** 是否实名认证 0-未认证 1-已认证 */
  isReal: number;
  /** 用户地址code 省市区 */
  areaCode: string;
  /** 用户地址名 */
  areaName: string;
  /** 国家 */
  country: string;
  /** 省 */
  province: string;
  /** 市 */
  city: string;
  /** 区 */
  county: string;
  /** 详细地址 */
  address: string;
  /** 兴趣爱好 */
  hobby: string;
  /** 职业 */
  profession: string;
  /** 积分 */
  points: number;
  /** [身份证]_正面信息 */
  realPositive: string;
  /** [身份证]_反面信息 */
  realBack: string;
  /** [身份证]_真实姓名 */
  realName: string;
  /** [身份证]_性别 0-女 1-男 2-未知 */
  realSex: number;
  /** [身份证]_身份证号 */
  realIdCard: string;
  /** [身份证]出生年月日 */
  realBirthday: string;
  /** [身份证]_民族 */
  realNationality: string;
  /** [身份证]_签发机关 */
  realIssue: string;
  /** [身份证]_开始时间 */
  realCardStartTime: string;
  /** [身份证]_结束时间 */
  realCardEndTime: string;
  /** 最后登录时间 */
  lastLoginTime: string;
  /** 是否登录成功 */
  isSuccess: number;
  /** 部门编码 */
  departmentCode: string;
  /** 部门名称 */
  departmentName: string;
}

/**
 * 执法室列表响应数据
 */
export interface GetRoomListRes {
  /** 房间编号 */
  roomCode: string;
  /** 房间名称 */
  roomName: string;
  /** 房间英文名称 */
  roomEng: string;
  /** 房间密码 */
  roomPassword: string;
  /** 是否自动录像（0：否，1:是） */
  isTranscribe: number;
  /** 备注 */
  remark: string;
  /** 录制状态 */
  recordState: string;
  /** 取证室状态：0已离线(默认)，1休息中，2执法中，9待呼叫 */
  isPut: number;
  /** 已办理案件总数 */
  finishNum: number;
  /** 当前办理人员，多个以逗号隔开 */
  nowPeople: string;
  /** 当前占用人id */
  useAdmin: string;
  /** 当前占用人名称及电话 */
  useAdminName: string;
}

export interface GetEnforcementStatusRes {
  id: string;
  tenantCode: string;
  orgCode: string;
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
  lawTypeName: string;
  /** 违法行为 */
  lawBehavior: string;
  lawBehaviorName: string;
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
  /** 呼叫的房间号 */
  roomCode: string;
  roomName: string;
  /** 房间密码 */
  roomPassword: string;
  /** 案件状态：0-准备、1-呼叫中、2-已接听、3-办结（结束案件/录屏）、4-未接听（小程序3分钟内未接听）、9-拒绝 */
  isPut: number;
  /** 开始录制时间 */
  startTime: string;
  /** 结束录制时间 */
  endTime: string;
  /** 小鱼录制的seesion */
  sessionId: string;
  /** 录制状态 */
  recordState: string;
  /** 违法时间 */
  lawDate: string;
  /** 管理端操作人员id */
  pcAdmin: string;
  /** 管理端操作人员名称 */
  pcAdminName: string;
  /** 管理端操作人员操作时间 */
  pcAdminDate: string;
  /** 创建人编码 */
  createBy: string;
  /** 创建人名称 */
  createName: string;
  /** 创建时间 */
  createTime: string;
}
