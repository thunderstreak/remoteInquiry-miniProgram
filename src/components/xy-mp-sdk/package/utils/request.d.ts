import { IHttpResponse, HandType, CovertPDFConfig } from '../type/index';
declare class Action {
    private baseUrl;
    private http;
    private userInfo;
    private logger;
    constructor();
    setBaseUrl(url: any): void;
    setUserInfo(userInfo: any): void;
    setLogger(logger: any): void;
    log(title?: string, data?: any): void;
    login(token: any): Promise<IHttpResponse>;
    loginExternalAccount(params: any): Promise<IHttpResponse>;
    /**
     * PDF转图片
     *
     * @param { CovertPDFConfig } params
     * @returns
     */
    convertPDF(params: CovertPDFConfig): Promise<IHttpResponse>;
    /**
     *v2版本，会议号校验，不校验SK是否失效
     *
     * @param { string } encodeNumber - 会议号
     * @returns
     */
    getCallUrlInfo(encodeNumber: string): Promise<IHttpResponse>;
    /**
     * v3版本，会议号校验，会校验SK是否失效
     *
     * @param { string } encodeNumber - 会议号
     * @returns
     */
    getCallUrlInfoV3(encodeNumber: string): Promise<IHttpResponse>;
    verifyMeetingPwd({ number, passwd }: {
        number: any;
        passwd: any;
    }): Promise<IHttpResponse>;
    /**
     * 信令多活：获取信令服务信息
     *
     * @param { string } callUrl - 会议号callUrl
     * @returns
     */
    getAllocation(callUrl?: string): Promise<IHttpResponse>;
    /**
     * 举手发言、取消举手
     *
     * @param { HandType } type 操作类型
     * @param { Record<string, string>} param
     * @property { string } param.callUri - 终端callUri
     * @property { string } param.meetingId - 会议ID
     * @property { string } param.conferenceNumber - 会议室号
     * @returns
     */
    hand(type: HandType, { callUri, meetingId, conferenceNumber }: {
        callUri: any;
        meetingId: any;
        conferenceNumber: any;
    }): Promise<IHttpResponse>;
    /**
     * 获取设备上报时间描述接口
     *
     * @returns
     */
    getEventDescription(): Promise<IHttpResponse>;
    /**
     * 会议事件埋点
     *
     * @param {*} priority
     * @param {*} callUri
     * @param {*} states
     * @returns
     */
    report(priority: any, callUri: any, states: any): Promise<IHttpResponse>;
    /**
     * 获取参会者头像
     *
     * @param { string } callUrl 待获取头像的参会者callUri
     * @returns
     */
    getInComingCallUrlInfo(callUrl: any): Promise<{
        avatar: string;
    }>;
    /**
     * 获取会议邀请链接信息
     *
     * @param { Object } params 邀请链接请求参数
     * @param { string } params.conferenceNumber 会议号
     *
     * @returns
     */
    getMeetingInviteInfo(params: {
        conferenceNumber: string;
        meetingId: string;
    }): Promise<IHttpResponse>;
}
declare const _default: Action;
export default _default;
