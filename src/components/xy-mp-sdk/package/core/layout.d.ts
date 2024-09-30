import { LayoutInfo, IPlayUrlItem, IRoster, RosterObj, CustomTemplateInfo, SpeakerInfo, MPFunction } from '../type/index';
import XYRTC from './xyrtc';
declare class LayoutManager {
    adjustResolution: MPFunction;
    adjustBandwidth: MPFunction;
    streamRequest: MPFunction;
    private client;
    private logger;
    private stream;
    private rosterList;
    private orderRosterList;
    private layoutMap;
    private audioLayoutMap;
    private initLayout;
    private layoutList;
    private localLayout;
    private template;
    private content;
    private speaksInfo;
    private audioPullUrls;
    private isHorizontal;
    private contentSenderPid;
    private fullFlag;
    private adjustAssignment;
    constructor(client: XYRTC);
    getLayout(): LayoutInfo[];
    getLocalLayout(): LayoutInfo;
    getAudioLayout(): any[];
    /**
     * 设置实时讲话人信息
     *
     * @param { SpeakerInfo[] } speakers
     */
    setSpeakerInfo(speakers: SpeakerInfo[]): void;
    /**
     * 全量unmute Audio pull url
     *
     * @param { IPlayUrlItem[] } audioPullUrls
     */
    setAudioPullUrl(audioPullUrls?: IPlayUrlItem[]): void;
    /**
     * 更新Local layout信息
     *
     * @param { IRoster } localRoster
     */
    updateLocalLayout(localRoster: Partial<IRoster>): void;
    /**
     * [auto] 处理实时讲话人信息
     *
     */
    handleSpeakerInfo(): void;
    /**
     * [custom]自定义布局更新模板
     *
     * @param { CustomTemplateInfo []} template - 自定义模版
     */
    updateTemplate(template?: CustomTemplateInfo[]): void;
    /**
     * 创建layout布局和请流
     * @returns
     */
    createLayoutAndStreams(): void;
    /**
     * 创建layout
     */
    createLayout(): void;
    /**
     * 1. 计算模版
     */
    calcTemplate(): void;
    /**
     *  2. 创建基础layoutMap
     */
    createBaseLayout(): void;
    /**
     * 3. 赋值playUrl信息，更新status
     */
    updateLayoutPlayUrlList(oriLayoutMap?: Map<string, LayoutInfo>): void;
    /**
     * 请流
     */
    createRequestStreams(layoutList?: LayoutInfo[]): void;
    /**
     * 视频播放开始,更新Layout状态
     *
     * @param { string } id LayoutId
     */
    updateLayoutStatus(id: string): void;
    /**
     * 自建模式下，创建画面外未静音的layout
     *
     */
    createAudioLayout(): void;
    /**
     * [auto]设置全屏状态
     *
     * @param { LayoutInfo } item
     */
    setFullScreen(item: LayoutInfo): void;
    /**
     * [auto] 处理全屏Layout
     *
     * @returns {boolean}  是否是全屏状态，true: 全屏，不处理后续Layout; false: 退出全屏
     */
    handleFullScreen(): boolean;
    /**
     * rouster排序
     *
     * 按照content，chairMain，AS，其他，排序roster数据
     *
     * @param { RosterObj } Obj
     * @param { number } Obj.contentSenderPid 0|1
     * @param { IRoster[] } Obj.rosterV
     */
    setOrderRosters(Obj: RosterObj): any[];
    /**
     * 同一优先级的roster, 按照之前的roster顺序排序
     *
     * @param { IRoster[] } newOrderRoster 新的roster数据
     * @param { IRoster[] } oldOrderRoster 缓存的之前的roster数据
     * @returns { IRoster[] } 排序后的roster数据
     */
    private diffRoster;
    /**
     * 返回item在oldOrderRoster的index
     *
     * @param { IRoster } item
     * @param { IRoster[] } oldOrderRoster
     * @param { number } newRosterLen
     * @returns { number }
     */
    private getIndexInRoster;
    /**
     * 根据callNumber查找roster
     *
     * @param { IRoster[] } rosters 参会者列表
     * @param { CustomTemplateInfo } item 要查找的参会者信息
     * @returns { IRoster | null } 查找到的参会者信息
     */
    private getRosterByCallNumber;
    /**
     * 媒体下发 小鱼向wx请流 的信息
     *
     * @param { StreamRequestInfo } Obj
     */
    private onStreamRequest;
    /**
     * live-pusher 推流动态调整分辨率
     *
     * @param { AdjustAssignmentInfo } Obj
     */
    private onAdjustResolution;
    /**
     * live-pusher 推流动态调整码率
     *
     * @param {AdjustAssignmentInfo} Obj
     */
    private onAdjustBandwidth;
    /**
     * 当接收到StreamRequest时，被动发送StreamAssignment消息
     *
     * @param { number } type
     * @returns
     */
    private onSendStreamAssignment;
    /**
     * [auto]获取Layout位置样式
     *
     * @param {number[]} position 位置信息 left/top/width/height
     * @returns { string } 样式字符串
     */
    private getLayoutPositionStyle;
    /**
     * [custom]获取Layout位置样式
     *
     * @param { number | string[] } position - template模版定义的position位置和大小信息， 如果是number，则转换成vw/vh单位，如果是string，则直接拼接
     * @returns { string } 样式字符串
     */
    private getCustomPositionStyle;
    /**
     * 更新layout Item playUrl/status
     *
     * @param { LayoutInfo } item  需要更新的layout信息
     * @param { PlayerUrlInfo[] }  playerUrlList 参会者拉流地址
     */
    private updateLayoutItemPlayUrl;
    /**
     * 移除无用Layout
     *
     * @param { Map<string, LayoutInfo> } layoutMap
     */
    private clearInvalidLayout;
    /**
     * layoutMap转换成list
     */
    private getLayoutList;
    /**
     * 上报Layout 数据
     */
    private emitLayout;
    /**
     * 获取roster ID
     *
     * @param { IRoster } roster 参会者信息
     * @returns { number } ID 参会者ID
     */
    private getRosterId;
}
export default LayoutManager;
