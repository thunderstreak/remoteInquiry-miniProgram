/// <reference types="wechat-miniprogram" />
/// <reference types="wechat-miniprogram" />
/// <reference types="wechat-miniprogram" />
/**
 * 小鱼小程序SDK模块
 *
 * @summary Core Meeting Lib
 *
 * Created at     : 2022-09-06 16:24:53
 * Last modified  : 2024-04-19 10:23:16
 */
import Log from './logger';
import Emitter from '../utils/emitter';
import { MeetingInfo, UserInfo, StatusInfo, UploadLogContent, ClientConfig, MeetingControl, PlayerUrlInfo, MPFunction, LayoutInfo, LogType, MakeCallParams, LayoutMode, CustomTemplateInfo, LoginExternalAccountParams, CovertPDFConfig, ShowToastConfig, CustomMessageConfig, ReqListInfo, FeatureConfig, ConnectedInfo, SnapshotParams, VideoProfile, InviteInfo } from '../type/index';
declare class XYRTC extends Emitter {
    private config;
    private logger;
    private versionText;
    private featureConfig;
    private socketTask;
    private retryRoomsigTimmer;
    private meetingInfo;
    private userInfo;
    private isClose;
    private retryNetwork;
    private seq;
    private cameraPosition;
    private mediaChanged;
    private firstIn;
    private INVITE;
    private meetingControl;
    private onhold;
    private disconnected;
    private systemInfo;
    private layoutManager;
    private pusher;
    private playerContexts;
    private playerUrlList;
    private audioPlayerUrlList;
    private netWorkLevel;
    private qualityManager;
    private buryPoint;
    private meeting;
    private clientImplements;
    private ctx;
    private componentInstance;
    private isAudioMute;
    private isVideoMute;
    private serverId;
    private networkInfo;
    private userList;
    private audioUserList;
    private layoutList;
    private rosterObj;
    private videoProfile;
    private pushUrlConfig;
    private keepScreenOnTimer;
    private nqLevelTimer;
    private printNetworkLog;
    private pusherNetworkLog;
    private playerNetworkLog;
    static instance: XYRTC;
    static version: {
        version: any;
        time: any;
    };
    constructor(config: ClientConfig);
    /**
     * Client配置参数
     *
     * @static
     * @param { ClientConfig } config - 配置参数
     * @property { string } config.server - 服务地址，默认使用正式环境
     * @property { string } config.appId - SDK应用ID，通过小鱼易连企业管理平台创建
     * @property { string } config.extId - SDK企业ID，通过小鱼易连企业管理平台创建
     * @property { string } config.layoutMode - 布局模式: auto/custom 默认:auto
     * @property { boolean } config.report - 质量数据上报，默认: false
     * @property { { offset?: number[] } } config.container - 非必填 | {} | 配置layout container偏移量
     * @property { number[] } config.container.offset - 非必填 | [] | 配置[left top width height]的偏移量，自动布局适用
     */
    static createClient(config?: ClientConfig): XYRTC;
    static getClient(): XYRTC;
    /**
     * 微信版本是否支持SDK
     * 最低支持SDKVersion 2.19.2
     * Android版本 8.0.7 / iOS版本 8.0.8
     *
     * @static
     * @returns { boolean } isSupport 微信版本是否支持SDK
     */
    static checkSupportMp(): boolean;
    getSystemInfo(): WechatMiniprogram.SystemInfo;
    getConfig(): ClientConfig;
    getPusherInstance(): WechatMiniprogram.LivePusherContext;
    getPlayerUrlList(): PlayerUrlInfo[];
    getAudioPlayerList(): PlayerUrlInfo[];
    getPlayerContexts(): Record<string, WechatMiniprogram.LivePlayerContext>;
    getInvite(): ConnectedInfo;
    getMeetingInfo(): MeetingInfo;
    getMeetingControl(): MeetingControl;
    getOnhold(): boolean;
    getUserInfo(): UserInfo;
    getLayoutMode(): LayoutMode;
    getLogger(): Log;
    getFeatureConfig(): FeatureConfig;
    getLayoutList(): LayoutInfo[];
    getPageInstance(): WechatMiniprogram.Page.TrivialInstance;
    /**
     * 获取会议分享详情信息
     *
     * @returns {Promise<InviteInfo>}
     */
    getMeetingInviteInfo(): Promise<InviteInfo>;
    /**
     * 获取不同分辨率下的配置信息(目前只支持自建模式)
     *
     * @returns
     */
    getMediaConfig(): {
        maxVideoHeight: number;
        maxResolution: string;
        maxBandwidth: number;
        pusherConfig: {
            maxBitrate: number;
            minBitrate: number;
            mode: string;
        };
    };
    destroy(): void;
    /**
     * 设置当前page的上下文
     * createClient之后，立即调用此方式设置当前page的上下文，避免在调用实例方法的时候会出现无法获取的情况
     *
     * @public
     * @param { WechatMiniprogram.Page.TrivialInstance } ctx  当前 page 的上下文
     */
    setPageInstance(ctx: WechatMiniprogram.Page.TrivialInstance): void;
    /**
     * UI组件实例
     *
     * @public
     * @param { WechatMiniprogram.Component.TrivialInstance } componentInstance
     */
    setComponentInstance(componentInstance: WechatMiniprogram.Component.TrivialInstance): void;
    /**
     * setConfig
     *
     * @public
     * @param { ClientConfig } config 配置参数
     */
    setConfig(config: ClientConfig): void;
    /**
     * SDK功能控制开关
     *
     * @public
     * @param { FeatureConfig } config 功能配置项
     * @property { boolean } config.enableMeetingInvite 是否启用查询小鱼会议邀请链接信息，默认不启用，设置为false；
     * @property { boolean } config.enableLayoutAvatar 是否启用获取参会者头像，默认不启用，设置为false;
     */
    setFeatureConfig(config?: FeatureConfig): void;
    /**
     * 设置视频配置，呼叫前设置有效
     *
     * @public
     * @param { VideoProfile } videoProfile 配置参数
     * @property { 360 | 720 } maxResPvtx 最大发送分辨率
     */
    setVideoProfile(videoProfile?: VideoProfile): void;
    /**
     * 设置布局模式
     * auto 自动布局，布局内容由sdk内部实现
     * custom 自定义布局，第三方根据自己业务实现
     *
     * @public
     * @param { LayoutMode } mode 'auto' | 'custom', 默认'auto'
     */
    setLayoutMode(mode?: LayoutMode): this;
    /**
     * 设置服务地址
     * 建议： 在入会前调用
     *
     * @public
     * @param { string } server  eg:xxx.xxx.xxx:port  不需要提供协议头，只需要提供完整的域名+端口
     */
    setServer(server: string): void;
    /**
     * 设置日志服务地址
     *
     * @public
     * @param { string } server 日志地址 eg:xxx.xxx.xxx:port  不需要提供协议头，只需要提供完整的域名+端口
     */
    setLogServer(server: string): void;
    /**
     *
     * @param { string } id - layoutID
     * @param { WechatMiniprogram.LivePlayerContext } context - LivePlayerContext
     */
    setPlayerContext(id: string, context: WechatMiniprogram.LivePlayerContext): void;
    /**
     * 登录小鱼方法，必须在入会之前调用，获取小鱼系统的唯一标示`callNumber`,作为第三方和小鱼系统用户对应的依据
     *
     * @public
     * @param { string } token - 登录所需的参数：token
     * @param { MPFunction } cb - 执行结束的回调函数，返回callNumber
     * @returns  { Promise<StatusInfo> } 登录用户信息
     */
    login(token: string, cb?: MPFunction): Promise<StatusInfo>;
    /**
     * 第三方账号登录
     *
     * @public
     * @param { LoginExternalAccountParams } params 登录配置
     * @property { string } params.extUserId 第三方 userId，规则：数字、字母、\_-, 且长度不能超过 50字符；
     * @property { string } params.displayName 第三方用户名称
     * @returns  { Promise<StatusInfo> } 登录用户信息
     */
    loginExternalAccount(params: LoginExternalAccountParams): Promise<StatusInfo>;
    /**
     * PDF转图片
     *
     * @public
     * @param { CovertPDFConfig } config - PDF参数
     * @property { string } config.pdfURL - PDF地址
     * @property { string } config.pdfMD5 - PDF MD5值
     * @property { string } config.compressLevel - 转图片时压缩比例，0-100，表示压缩等级百分比，传100就是不压缩，传1就是压缩为1%，默认是60
     * @param { MPFunction } cb - 回调结果函数
     */
    convertPDF(config: CovertPDFConfig, cb: MPFunction): boolean;
    /**
     * 呼叫接口
     * 该接口执行呼叫，成功后即可进行入会相关操作。
     *
     * @public
     * @param {MakeCallParams}  params
     * @property {string}  params.number - 云会议室号
     * @property {string}  params.password - 云会议室入会密码, 默认填写为""
     * @property {string}  params.displayName - 入会名称
     * @property {boolean} params.isAudioMute - 关闭音频入会
     * @property {boolean} params.isVideoMute - 关闭视频入会
     * @property {string}  params.cameraPosition - 前置或后置摄像头, 可选值：front，back
     * @param { MPFunction } cb 执行结束的回调函数，提示会议室信息状态（无效的号码，需要输入密码，网络错误...）
     * @returns { Promise<StatusInfo> } 会议信息
     */
    makeCall(params: MakeCallParams, cb?: MPFunction): Promise<StatusInfo>;
    /**
     * 设置是否进行内部事件的console和写入logger文件中
     *
     * @public
     * @param { boolean } isConsole - 是否打印console.log
     * @param { boolean } isLogger - 是否写入到本地log文件
     */
    setDebug(isConsole?: boolean, isLogger?: boolean): void;
    /**
     * 设置日志类型
     *
     * @public
     * @param { LogType } type 0:微信默认日志，1:小鱼自定义日志 默认值:0
     */
    setLogType(type?: LogType): void;
    /**
     * 上传日志
     *
     * @public
     * @param { UploadLogContent } Obj
     * @property { string } Obj.account   // 上传账号
     * @property { string } Obj.comments  // 上传时备注信息
     * @returns { Promise<Object> } 上传结果
     */
    uploadLog(obj?: UploadLogContent): Promise<unknown>;
    /**
     * 静音
     *
     * @public
     */
    muteAudio(): void;
    /**
     * 取消静音
     *
     * @public
     */
    unmuteAudio(): void;
    /**
     * 关闭摄像头
     *
     * @public
     * @property { number } reason - 关闭原因，0-7数值
     * 分辨按顺序代表：
     * MuteByUser用户自行关闭视频
     * MuteByBWLimit：带宽太低，媒体自动关闭
     * MuteByNoInput：没有输入设备
     * MuteByConfMgmt：通过会控关闭
     * MuteByDeviceDetection：设备检测关闭
     * MuteByPhoneCall：电话接入，自动关闭
     * MuteBySync：应用切后台
     */
    muteVideo(reason?: number): void;
    /**
     * 开启摄像头
     *
     * @public
     */
    unmuteVideo(): void;
    /**
     * 举手发言 操作
     *
     * @public
     * @returns { Promise<boolean> } 是否举手
     */
    onHandUp(): Promise<unknown>;
    /**
     * 取消举手 操作
     *
     * @public
     * @returns { Promise<boolean> } 是否举手
     */
    onHandDown(): Promise<unknown>;
    /**
     * 结束发言 操作
     *
     * @public
     * @returns { Promise<boolean> } 是否举手
     */
    onMute(): Promise<unknown>;
    /**
     * 切换摄像头方向
     *
     * @public
     * @returns { Promise<CameraPosition> } 摄像头方向
     */
    switchCamera(): Promise<unknown>;
    /**
     * 订阅参会者信息
     *
     * @public
     */
    subscribeBulkRoster(): Promise<unknown>;
    /**
     * 挂断会议
     *
     * @public
     * @param { string? } reason - 挂断原因
     */
    hangup(reason?: string): void;
    /**
     * [custom]自定义布局更新模板
     *
     * @public
     * @param { CustomTemplateInfo []} template - 自定义模版
     * @property { string } callNumber  - 必填 指定参会者的呼叫号码，此数据可以从 Roster List 数据中获取
     * @property { number[] } position - 必填 指定参会位置和大小信息，数值对应的单位分别是：x和width: vw，y和height：vh
     * @property { string } name - 必填 指定参会者名称，此数据可以从 Roster List 数据中获取；
     * @property { QualityType } quality - 必填 指定参会者名称，指定参会者画面清晰度，建议将大屏画面设置为 high，小屏画面设置为 normal，content 设置为 hd
     * @property { boolean } isContent - 非必填 指定当前位置是否是 Content 共享内容，从 Roster List 数据中的 isContent 可以获取此值；
     * @property { string } style  - 非必填 样式
     */
    updateTemplate(template?: CustomTemplateInfo[]): void;
    /**
     * [auto]全屏显示Layout
     *
     * @public
     * @param { LayoutInfo } 需要全屏展示的Layout信息
     */
    handleFullScreen(item: LayoutInfo): void;
    /**
     * 请流
     *
     * @public
     * @param { ReqListInfo[] } reqList 请流参数
     * @property {string} resolution 分辨率 '640_360'
     * @property {string} frameRate 帧率
     * @property {number} bandwidth 带宽
     * @property {number} pid roster pid
     * @property {number} priority 0
     */
    requestLayout(reqList?: ReqListInfo[]): void;
    /**
     * 推流
     *
     * @public
     * @param { MPFunction } successCB - 成功回调事件
     * @param { MPFunction } failCB - 失败回调事件
     */
    startLivePusher(successCB: MPFunction, failCB: MPFunction): void;
    /**
     * 停止推流
     *
     * @public
     */
    stopPushLive(): void;
    /**
     * 创建 live-player 实例
     *
     * @public
     * @param { string } playerId live-player实例ID - 默认不传值，播放所有远端流
     */
    startLivePlayer(playerId?: string): void;
    /**
     * 绑定live-pusher状态变化事件
     *
     * @public
     * @param { any } e
     */
    pusherEventHandler(e: any): void;
    /**
     * 绑定live-pusher网络状态数据
     *
     * @public
     * @param { any } e
     */
    pusherNetStatusHandler(e: any): void;
    /**
     * 绑定live-pusher播放音量大小事件
     *
     * @public
     * @param { any } e
     */
    pusherAudioVolumeNotify(e: any): void;
    /**
     * 绑定live-pusher渲染错误事件
     *
     * @public
     * @param { any } e
     */
    pusherErrorHandler(e: any): void;
    /**
     * 绑定live-player网络状态数据
     *
     * @public
     * @param { * } e
     */
    playNetStatusHandler(e: any): void;
    /**
     * 绑定live-player播放状态变化事件
     *
     * @public
     * @param { * } e
     */
    playerEventHandler(e: any): void;
    /**
     * 绑定live-player播放音量大小事件
     *
     * @public
     * @param { any } e
     */
    playAudioVolumeNotify(e: any): void;
    /**
     * 发送自定义消息
     *
     * @public
     * @param { CustomMessageConfig } config - 配置参数
     * @property { number } config.toPid - 消息的接收方pid，0表示广播消息、非0表示单播消息；
     * @property { string } config.data - 消息内容，base64编码；因业务数据可能会传输图片，需要对二进制数据进行base64编码，消息长度限制最大：1MB
     * @return { { code: string, message: string, data: null | object } } 返回结果
     */
    sendCustomMessage(config: CustomMessageConfig): StatusInfo;
    /**
     * 指定画面屏幕截图
     *
     * @param { SnapshotParams } params 参数
     * @property { string } params.id - layoutId
     */
    getSnapshot(params: SnapshotParams): Promise<StatusInfo | import("../type/xyrtc").SnapshotResult>;
    /**
     * 显示Toast提示
     *
     * @public
     * @param { ShowToastConfig | string  } params - 配置Toast参数，如果是string，则代表Toast内容值
     * @property { string } params.title - Toast内容
     * @property { number } params.duration - Toast持续显示时间
     * @property { boolean } params.mask - Toast是否显示遮罩
     * @property { ToastIcon } params.icon - Toast图标，默认没有
     * @property { MPFunction } hideCallback - 隐藏Toast时的回调函数
     */
    showToast(params: ShowToastConfig | string, hideCallback?: () => void): void;
    /**
     * layout
     *
     * @private
     * @param { LayoutInfo[]} layoutList
     */
    emitLayout(layoutList?: LayoutInfo[]): Promise<void>;
    /**
     * 上报会议信息
     *
     * @param { MeetingInfo } data 会议信息，包含邀请信息
     */
    emitMeetingInfo(data: MeetingInfo): void;
    /**
     * 发送ws消息
     *
     * @param {Object} data
     * @param {Boolean} isAddBaseData 是否需要添加默认数据：callIndex和conferenceNumber
     * @param {Boolean} isPrintLog 是否打印
     */
    sendSocketMessage(data?: {}, isAddBaseData?: boolean, isPrintLog?: boolean): void;
    /**
     * 向onRoomEvent发送消息
     *
     * @param { string } type 事件type，具有唯一性
     * @param { any } detail 事件详情
     */
    postEvent(type: any, detail: any): void;
    /**
     * 设置用户信息
     *
     * @private
     * @param { UserInfo } userInfo
     */
    private setUserInfo;
    /**
     * 校验会议号
     *
     * @private
     * @param { string } number 云会议室号码
     * @param { string } password 云会议室密码
     * @returns
     */
    private getCallUrlInfo;
    /**
     * 信令多活，失败上报状态，成功正常入会
     *
     * @private
     * @returns
     */
    private getAllocationStatus;
    /**
     * 连接WSS
     *
     * @private
     */
    private init;
    /**
     * 本地举手、结束发言等操作
     *
     * @private
     * @param { HandType } type 操作类型
     * @param { boolean } handStatus 是否举手
     * @returns { Promise<boolean> } 举手状态
     */
    private onHand;
    /**
     * 获取LivePusherContext
     *
     * @private
     */
    private createLivePusher;
    /**
     * 验证入会密码
     *
     * @private
     */
    private verifyPassword;
    /**
     * 连接wss
     *
     * @private
     */
    private _connectWS;
    /**
     * 初始化ws监听事件
     *
     * @private
     */
    private _initWSHandle;
    /**
     * websocket断线重连
     *
     * @private
     */
    private _enterRoom;
    /**
     * start call
     *
     * @private
     */
    private _sendStartCall;
    /**
     * 处理ws消息
     *
     * @private
     * @param {Object} data
     */
    private handleMessage;
    /**
     * 接收PassThrough消息
     *
     * @param data
     */
    private handlePassThroughMessage;
    /**
     * roster排序，上报
     *
     * @private
     * @param { RosterObj } Obj
     */
    private handleRosterObj;
    /**
     * 等候室时，处理布局、暂停推流，rtmp模式不再请流
     *
     * @private
     */
    private onHoldScreen;
    /**
     * 接受到会控消息
     *
     * @private
     * @param { MeetingControl } msg
     */
    private onMeetingControlMessage;
    /**
     * 处理媒体迁会消息
     *
     * @private
     */
    private onMediaChangedMessage;
    /**
     * 关闭页面，关闭ws，关闭推流
     *
     * @private
     */
    private onCloseMeeting;
    /**
     * 退出页面时，重置所有timmer
     *
     * @private
     */
    private _resetTimmer;
    /**
     * 设置、更新Layout拉流地址
     *
     * @private
     * @param { PlayerUrlInfo[] } list
     */
    private setPlayerUrlList;
    /**
     * 在小程序检测到推流连接断开时，可以请求更新推流地址
     *
     * @private
     */
    private requestPushUrl;
    /**
     * 处理playList
     *
     * @private
     * @param {string} msg
     */
    private onWebRTCUserListPush;
    /**
     * 异常退出
     *
     * @private
     * @param { StatusInfo } detail 异常信息
     */
    private exitRoom;
    /**
     * 更新pusher网络状态数据
     *
     * @private
     */
    private pusherNetStatusLog;
    /**
     * 每隔4s更新成员数据，剔除不在screen中的人员网络数据
     *
     * @private
     */
    private playerNetStatusLog;
    /**
     * 网络等级计算
     *
     * 根据拉流和推流网络等级，计算一个最小的level值作为质量等级
     */
    private reportLocalNetworkLevel;
    /**
     * 上报meetingStats
     *
     * @private
     */
    private throttlePrintNetStatusLog;
    /**
     * 会议事件埋点上报
     *
     * @param {string} category 消息类型
     * @param {string} eventName 具体事件
     * @param {Record<string, any>} eventValue 扩展字段
     */
    private report;
    /**
     * 保持屏幕常亮定时器
     *
     * 备注：此处微信存在BUG，调用一次不支持常亮，需要定时去掉用
     */
    private setKeepScreenOnTimer;
    /**
     * 保持屏幕常亮
     */
    private keepScreenOn;
    /**
     * 监听小程序切前台、后台事件
     */
    private onPage;
    /**
     * 监听小程序错误事件。如脚本错误或 API 调用报错等。
     *
     * @param { any } obj
     */
    private handleAppError;
    /**
     * 监听小程序切前台事件
     */
    private handleAppShow;
    /**
     * 监听小程序切后台事件
     */
    private handleAppHide;
    /**
     * 监听小程序内存不足告警事件
     */
    private onMemoryWaring;
    /**
     * 上报小程序内存消耗情况
     *
     * @param { number } level - 5 ｜ 10 ｜ 15，内存不足等级
     */
    private handleMemoryWaring;
}
export default XYRTC;
