/**
 * 会议事件埋点
 */
import Log from '../core/logger';
import { IEventDescription } from '../type/index';
declare class BuryPoint {
    private logger;
    private timeDiff;
    private intervals;
    private meetingInfo;
    private timer;
    private eventDescription;
    static instance: BuryPoint;
    constructor(logger?: Log);
    static getInstance(logger?: Log): BuryPoint;
    /**
     * 销毁BuryPoint
     */
    destroy(): void;
    setMeetingInfo(meetingInfo: any): void;
    /**
     * 初始化
     */
    init(): void;
    getEventDesByTimer(): void;
    /**
     * 获取设备上报时间描述接口
     *
     * @returns { IEventDescription } eventDescription
     */
    getEventDescription(): Promise<IEventDescription>;
    /**
     * 获取事件的优先级
     *
     * @param { string } category - 事件类别
     * @returns  { string } priority - 优先级
     */
    getPriority(category: string): string;
    /**
     * 数据埋点
     *
     * @param { string } category  - 事件类别
     * @param { string } eventName  - 事件名称
     * @param { Objet } eventValue - 事件详细数据
     */
    report(category: string, eventName: string, eventValue?: {}): Promise<void>;
}
export default BuryPoint;
