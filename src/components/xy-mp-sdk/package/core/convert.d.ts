/**
 * CovertPDF to Image List
 *
 * @summary covertPDF to image
 * @author Luojinghui
 *
 * Created at     : 2022-12-05 15:39:28
 * Last modified  : 2023-06-05 16:58:22
 */
import { MPFunction, CovertPDFConfig } from '../type/index';
declare class CovertPDF {
    private pdfURL;
    private pdfMD5;
    private enterpriseId;
    private compressLevel;
    private retryCount;
    private retryTimeout;
    private maxCount;
    private completedCB;
    private timer;
    constructor(option: CovertPDFConfig);
    start(cb: MPFunction): Promise<void>;
    destroy(): void;
    clearTimer(): void;
    /**
     * 请求/查询PDF转图片结果
     */
    actionCovertPDF(): Promise<void>;
}
export default CovertPDF;
