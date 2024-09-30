/**
 * 会议质量上报
 *
 * 此功能因媒体原因，暂未联调完成
 */
import { NetworkInfo } from '../type/index';
declare class QualityManager {
    private client;
    private version;
    private INVITE;
    private networkInfo;
    private networkType;
    private meetingQualityData;
    constructor(client: any);
    /**
     * 定时上报会议质量、网络数据
     *
     * @public
     * @param { NetworkInfo } networkInfo
     */
    reportQualityData(networkInfo: NetworkInfo): void;
    /**
     * 停止上报网络数据
     *
     * @public
     */
    stopReportData(): void;
    /**
     * 发送会议质量数据
     *
     * @private
     * @param { number ? } sessionName 0:people 1:content
     * @param { boolean ? } isLast 挂断状态
     */
    private calcQualityData;
}
export default QualityManager;
