import XYRTC from './xyrtc';
import { IBulkRoster, LayoutInfo, IRoster } from '../type/index';
declare class Meeting {
    private client;
    private logger;
    private isSubscribeBulkRoster;
    private bulkRoster;
    private layoutAvatarMap;
    constructor(client: XYRTC);
    getLayoutAvatarMap(): Map<string, IRoster>;
    /**
     * 重置初始化参数
     */
    resetInitParameter(): void;
    /**
     * 重新订阅参会者信息
     */
    handleSubscribeBulkRoster(): Promise<void>;
    /**
     * 订阅参会者信息
     *
     */
    subscribeBulkRoster(): Promise<unknown>;
    /**
     * 处理参会者消息
     * 参会者信息 是增量消息
     * bulkRosterType: 0 - 全量roster, 1 - 增量roster
     * addRosterInfo  新增的参会者信息  当bulkRosterType是0的时候，此参数表示全量数据
     * changeRosterInfo  变化的参会者信息
     * deleteRosterInfo  被删除的参会者信息
     *
     * @param { IBulkRoster } e  参会者信息
     * @returns { IRoster[] } 合并后的参会者信息
     */
    handleBulkRoster(e: IBulkRoster): IRoster[];
    /**
     * 处理layout图像
     *
     * @param { Object[] } layout 需要获取头像的终端
     * @param { boolean } isDealAvatar 是否处理头像
     *
     * @returns { LayoutInfo[] } 包含头像的Layout信息
     */
    handleLayoutAvatar(layout: LayoutInfo[], isDealAvatar?: boolean): Promise<LayoutInfo[]>;
    /**
     * 处理会议室信息
     *
     */
    handleConferenceInfo(): Promise<void>;
    /**
     * 获取邀请链接信息
     */
    getMeetingInviteInfo(): Promise<import("../type/meeting").InviteInfo>;
    /**
     * 获取参会者头像
     *
     * @param { LayoutInfo[] } unAvatarList 待获取头像的参会者信息
     */
    private setLayoutAvatar;
}
export default Meeting;
