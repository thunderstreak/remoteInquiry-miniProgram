/**
 * SDK登录用户信息
 *
 * @property { string } appId - 应用ID
 * @property { string } callNumber - 用户呼叫号码ID
 * @property { string } displayName - 登录用户名
 * @property { string } enterpriseId - 登陆企业ID
 * @property { string } securityKey - 安全码
 * @property { string } userId - 第三方用户ID
 */
export interface UserInfo {
    appId: string;
    callNumber: string;
    displayName: string;
    enterpriseId: string;
    securityKey: string;
    userId: string;
    countryCode?: string;
    phoneNumber?: string;
}
/**
 * 会议分享信息
 *
 * @property { string } displayName - 会议室名称
 * @property { boolean } inEnterprise - 所属会议号是否在企业中
 * @property { string } inviteAppUrl - 微信邀请链接
 * @property { string } inviteUrl - 云会议室邀请链接
 * @property { string } invokSchema - 小鱼客户端Scheme获取地址
 * @property { string } linkNumber - 电话入会号码
 * @property { string } mobileWebrtcVisibleSetting - 移动端是否显示WebRTC入会
 * @property { string } number - 会议号
 * @property { string } password - 入会密码
 * @property { string } pstnNumber - 电话呼叫号码
 * @property { string } shareUrl - 邀请链接详情页地址
 * @property { string } userAvatar - 管理员头像
 * @property { string } userName - 管理员名称
 * @property { string } userProfileId - 用户ID
 * @property { string } voiceNumber - 电话呼叫时的会议号
 * @property { string } webrtcSetting - PC端是否显示WebRTC入会
 * @property { string } webrtcUrl - WebRTC入会地址
 *
 */
export interface InviteInfo {
    displayName: string;
    inEnterprise: boolean;
    inviteAppUrl: string;
    inviteUrl: string;
    invokSchema: string;
    linkNumber: string;
    mobileWebrtcVisibleSetting: boolean;
    number: string;
    password: string;
    pstnNumber: string;
    shareUrl: string;
    userAvatar: string;
    userName: string;
    userProfileId: string;
    voiceNumber: string;
    webrtcSetting: boolean;
    webrtcUrl: string;
}
/**
 * 会议室信息
 *
 * @property { string } callNumber 最终进入的真实会议号
 * @property { string } callUrl 呼叫号码真实url
 * @property { string } deviceId 号码id
 * @property { string } deviceType 号码类型
 * @property { string } displayName 云会议号名称
 * @property { string } number 呼叫的号码
 * @property { string } numberType 会议号类型
 * @property { string } meetingId 当前会议ID
 * @property { string } password 会议密码
 * @property { InviteInfo } inviteInfo 会议邀请信息
 */
export interface MeetingInfo {
    callNumber?: string;
    callUrl?: string;
    deviceId?: string;
    deviceType?: string;
    displayName?: string;
    number?: string;
    numberType?: string;
    meetingId?: string;
    password?: string;
    inviteInfo?: InviteInfo;
}
/**
 * 会议信息
 *
 * @property {string} meetingId - 会议ID
 * @property {string} callUri - 设备ID
 * @property {string} conferenceNumber - 会议号
 * @property {number} rtmpMode 会议模式，0：trtc模式 1：rtmp自建模式
 * @property {number} callIndex - 会议序号
 * @property {number} automute - 是否自动静音、强制静音, 值： 'mute' | 'forcemute' | ''
 * @property {number} userId - 用户ID
 * @property {number} roomid - 房间ID
 */
export interface ConnectedInfo {
    meetingId: string;
    callUri: string;
    conferenceNumber: string;
    callIndex: number;
    rtmpMode: number;
    automute: string;
    roomid: number;
    userId?: string;
}
/**
 * 退会信息
 *
 * @property { string } code 错误码
 * @property { any } data 详情
 * @property { string } message 如果存在message，则提示信息并退会，否则直接退出会议；
 */
export interface DisconnectedInfo {
    code: string;
    data: object;
    message: string;
}
