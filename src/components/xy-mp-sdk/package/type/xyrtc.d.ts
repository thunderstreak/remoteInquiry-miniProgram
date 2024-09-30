import { LayoutMode, LogType } from './log';
import { NetworkQualityLevel } from './quality';
export type MPFunction = (...args: any[]) => any;
/**
 * client配置参数
 *
 * @property { string } server 非必填 服务地址, IP/域名 + 端口，如: wxrtc.xylink.com
 * @property { string } appId 非必填 SDK企业ID，通过小鱼易连企业管理平台创建
 * @property { string } extId 非必填 SDK应用ID，通过小鱼易连企业管理平台创建
 * @property { string } layoutMode 非必填 | AUTO | 布局模式，可选：AUTO | CUSTOM
 * @property { string } logServer 非必填 logServer服务地址，默认不需要配置
 * @property { { offset?: number[];  } } container 非必填 | {} | 配置layout container容器节点和偏移量
 * @property { number[] } container.offset 非必填 | [] | 配置[left, top, width, height]的偏移量，自动布局适用
 * @property { boolean } report 非必填 | false | 是否上报会议质量，默认不上报
 * @property { boolean } screenOn 非必填 | true | 是否常亮,默认常亮
 * @property { number } logType 非必填 | 0 | 日志类型, 默认微信LogManager
 * @property { number } orientation 非必填 | 'HORIZONTAL' | 自动布局下，横屏/竖屏展示，UI组件不支持
 */
export interface ClientConfig {
    server?: string;
    appId?: string;
    extId?: string;
    layoutMode?: LayoutMode;
    logServer?: string;
    container?: {
        offset?: number[];
    };
    screenOn?: boolean;
    report?: boolean;
    logType?: LogType;
    orientation?: string;
}
/**
 * SDK功能控制开关，用于内部是否启用某些功能的运行
 * 默认配置：src/enum/index.ts DEFAULT_FEATURE_CONFIG
 *
 * @property { boolean } enableMeetingInvite 是否启用查询小鱼会议邀请链接信息，默认不启用，设置为false；
 * @property { boolean } enableLayoutAvatar 是否启用获取参会者头像，默认不启用，设置为false;
 */
export interface FeatureConfig {
    enableMeetingInvite?: boolean;
    enableLayoutAvatar?: boolean;
    enableBandwidthSetting?: boolean;
}
/**
 * 远端参会者应用终止消息（视频无流）
 *
 * @property { string } callUri - 终端号
 * @property { boolean } freeze - 是否无流，true代表无流
 * @property { number } pid - 用户ID
 */
export interface IStreamStatusChanged {
    callUri: string;
    freeze: boolean;
    pid: number;
}
/**
 * 状态码信息
 *
 * @property {string} key - 新状态码
 * @property {string} code - 旧状态码
 * @property {any} data - 详情
 * @property {string} message - 描述信息
 */
export interface StatusInfo {
    key?: string;
    code?: string | number;
    data?: any;
    message?: string;
}
/**
 * 参会者拉流信息
 *
 * @property {string} userid 参会者userid
 * @property {string} playurl 参会者对应的拉流地址
 */
export interface IPlayUrlItem {
    userid: string;
    playurl: string;
}
/**
 * 参会者画面清晰度, 建议将大屏画面设置为 high，小屏画面设置为 normal，content 设置为 hd；
 */
export declare enum QualityType {
    NORMAL = "normal",
    HIGH = "high",
    HD = "hd"
}
/**
 * 自定义布局模版信息
 *
 * @property { string } callNumber 参会者的呼叫号码，此数据可以从 Roster List 数据中获取
 * @property { number|string[] } position 参会者位置和大小信息 [left, top, width, height], 如果指定数字，则默认单位是vw, vh；如果指定string, 则用户自定义样式单位
 * @property { string } name 参会者名称, 此数据可以从 Roster List 数据中获取
 * @property { QualityType } quality 参会者名称，指定参会者画面清晰度，建议将大屏画面设置为 high，小屏画面设置为 normal，content 设置为 hd；
 * @property { boolean } isContent 当前位置是否是 Content 共享内容
 * @property { string } style 自定义样式
 */
export interface CustomTemplateInfo {
    position: number[];
    callNumber: string;
    name: string;
    quality: QualityType;
    isContent?: boolean;
    style?: string;
}
/**
 * 小鱼布局模版信息
 *
 * @property { number[] } position 参会者位置和大小信息
 * @property { number } resolution 分辨率
 * @property { string? } type  参会者类型 LOCAL | CONTENT
 */
export interface IAutoTemplate {
    position: number[];
    resolution: number;
    type?: string;
}
/**
 * 当前讲话人信息
 *
 * @property { string } userId as参会者userId
 * @property { boolean } isActiveSpeaker 是否是as
 */
export interface SpeakerInfo {
    userId: string;
    isActiveSpeaker: boolean;
}
/**
 * [auto] 当前全屏显示的参会者UserId
 */
export interface IFullFlag {
    userId: string;
}
/**
 * 调整分辨率或编码码率
 *
 * @property { string? } resolution 分辨率
 * @property { number? } bandwidth 编码码率
 */
export interface AdjustAssignment {
    resolution?: string;
    bandwidth?: number;
}
/**
 * 会控回调信息
 *
 * @property { string } chairmanUri 主会场calluri
 * @property { boolean } disableMute 是否强制静音
 * @property { string } muteOperation 音频状态
 */
export interface MeetingControl {
    chairmanUri?: string;
    muteOperation?: string;
    disableMute?: boolean;
}
/**
 * 拉流地址信息
 *
 * @property { string } userid 参会者userid
 * @property { string } playurl 参会者拉流地址
 */
export interface PlayerUrlInfo {
    userid: string;
    playurl: string;
}
/**
 * 前置或后置摄像头
 *
 * @property  FRONT front - 前置
 * @property  BACK back - 后置
 */
export declare enum CameraPosition {
    FRONT = "front",
    BACK = "back"
}
/**
 * 呼叫参数
 *
 *
 * @property {string}  string - 云会议室号
 * @property {string}  password - 云会议室入会密码, 默认填写为""
 * @property {string}  displayName - 入会名称
 * @property {boolean} isAudioMute - 关闭音频入会
 * @property {boolean} isVideoMute - 关闭视频入会
 * @property {CameraPosition}  cameraPosition - 前置或后置摄像头, 可选值：front，back
 */
export interface MakeCallParams {
    number: string;
    password?: string;
    displayName?: string;
    isAudioMute?: boolean;
    isVideoMute?: boolean;
    cameraPosition?: CameraPosition;
}
/**
 * 登录配置
 *
 * @property { string } extUserId 第三方 userId，规则：数字、字母、\_-, 且长度不能超过 50字符；
 * @property { string } displayName 第三方用户名称
 */
export interface LoginExternalAccountParams {
    extUserId: string;
    displayName: string;
}
export type ToastIcon = 'success' | 'error' | 'loading' | 'none';
/**
 * Toast配置参会
 *
 * @property { string } title - Toast内容
 * @property { number } duration - Toast持续显示时间
 * @property { boolean } mask - Toast是否显示遮罩
 * @property { ToastIcon } icon - Toast图标，默认没有
 */
export interface ShowToastConfig {
    title: string;
    duration?: number;
    mask: boolean;
    icon: ToastIcon;
}
/**
 * 用户自定义消息
 *
 * @property { number } toPid - 消息的接收方pid，0表示广播消息、非0表示单点消息；
 * @property { string } data - 消息内容，可以被JSON序列化的字符串；因业务数据可能会传输图片，需要进行base64编码，消息最大长度限制：1MB
 */
export interface CustomMessageConfig {
    toPid: number;
    data: string;
}
/**
 * 请流参数
 *
 * @property {string} resolution 分辨率 '640_360'
 * @property {string} frameRate 帧率
 * @property {number} bandwidth 带宽
 * @property {number} pid roster pid
 * @property {number} priority 0
 */
export interface ReqListInfo {
    resolution: string;
    frameRate: number;
    bandwidth: number;
    pid: number;
    priority: number;
}
/**
 * 举手类型
 *
 * @param HANDUP handup - 举手发言
 * @param HANDUP handdown - 取消举手
 * @param HANDUP mute - 结束发言
 */
export declare enum HandType {
    HANDUP = "handUp",
    HANDDOWN = "handDown",
    MUTE = "mute"
}
/**
 * 接收到自定义消息
 *
 * @property { string } type - 消息Type
 * @property { number } fromPid - 消息的发送方pid
 * @property { number } toPid - 消息的接收方pid，0表示广播消息、非0表示单点消息；
 * @property { string } data - 消息内容，可以被JSON序列化的字符串；
 */
export interface IReceiveCustomMessage {
    type: string;
    fromPid: number;
    toPid: number;
    data: string;
}
/**
 * 远端参会者网络质量等级
 *
 * @param { string } fromCallUri - 远端参会者唯一标识ID
 * @param { number } fromPid - 远端用户ID
 * @param { NetworkQualityLevel } networkLevel - 网络等级，1差，2中，3良，4优
 */
export interface NetworkParameter {
    fromCallUri: string;
    fromPid: number;
    networkLevel: NetworkQualityLevel;
}
/**
 * 截图参数
 *
 * @property { string } id - LayoutID 参会者唯一ID
 * @property { 'raw' | 'compressed' } quality - 默认值:raw; raw：原图；compressed：压缩图
 * @property { 'stream' | 'view' } sourceType - 默认值:view; stream：截取视频源；view：截取渲染后的画面
 */
export interface SnapshotParams {
    id: string;
    quality?: 'raw' | 'compressed';
    sourceType?: 'stream' | 'view';
}
/**
 * 截图结果
 *
 * @property { string } tempImagePath - 图片文件的临时路径 (本地路径)
 * @property { string } width - 图片的宽度
 * @property { string } height - 图片的高度
 */
export interface SnapshotResult {
    tempImagePath: string;
    width: string;
    height: string;
}
/**
 * 本地视频配置
 *
 * @property { number } maxResPvtx - 最大发送分辨率
 */
export interface VideoProfile {
    maxResPvtx?: number;
}
/**
 * 推流地址状态
 *
 * @param { string } Reported - 已上报
 * @param { string } NotReported - 未上报
 */
export declare enum PushUrlStatus {
    Reported = "Reported",
    NotReported = "NotReported"
}
/**
 * 推流地址信息
 *
 * @param { string } url - 推流地址
 * @param { PushUrlStatus } status - 推流地址状态
 */
export interface PushUrlConfig {
    url: string;
    status: PushUrlStatus;
}
