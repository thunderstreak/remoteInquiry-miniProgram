/**
 * 小鱼易连-打印日志
 *
 * @authors Luo-jinghui (luojinghui424@gmail.com)
 * @date  2018-11-23 14:26:04
 */
/// <reference types="wechat-miniprogram" />
import { ILoggerConfig, LogType, LogUploadParam } from '../type/index';
declare class Log {
    private config;
    private isLogger;
    private isConsole;
    private isInit;
    private wxLogger;
    private logger;
    private systemInfo;
    /**
     * 初始化log选项
     *
     * @param {Boolean} isConsole 是否打印console.log
     * @param {Boolean} isLogger 是否写入到本地log文件
     */
    constructor(config: ILoggerConfig);
    getWxLogger(): WechatMiniprogram.LogManager;
    /**
     * 设置日志类型
     *
     * @param { LogType } type
     */
    setLogType(type?: LogType): void;
    /**
     * 设置Log Server服务器地址
     *
     * @public
     * @param { string } logServer Log服务器地址
     */
    setLogServer(logServer: any): void;
    /**
     * 初始化日志信息
     *
     * 根据type选择自定义日志或者微信自带日志
     */
    initLoggerInfo(): void;
    /**
     * 设置是否进行内部事件的console和写入logger文件中
     *
     * @public
     * @param { boolean } isConsole - 是否打印console.log
     * @param { boolean } isLogger - 是否写入到本地log文件
     */
    setDebug(isConsole?: boolean, isLogger?: boolean): void;
    /**
     * log方法
     *
     * @param {String} title log所对对应的key
     * @param {any} data log所对应的value
     * @param  {any} rest 其他数据
     */
    log(title?: string, data?: any, ...rest: any[]): void;
    /**
     * info方法
     *
     * @param {String} title log所对对应的key
     * @param {any} data log所对应的value
     * @param  {any} rest 其他数据
     */
    info(title?: string, data?: any, ...rest: any[]): void;
    /**
     * warn方法
     *
     * @param {String} title log所对对应的key
     * @param {any} data log所对应的value
     * @param  {any} rest 其他数据
     */
    warn(title?: string, data?: any, ...rest: any[]): void;
    /**
     * debug方法
     *
     * @param { string } title log所对对应的key
     * @param { any } data log所对应的value
     * @param { any } rest 其他数据
     */
    debug(title?: string, data?: any, ...rest: any[]): void;
    /**
     * 上传日志
     *
     * @param {LogUploadParam} params
     * @param {string} params.displayName // 上传文件名
     * @param {string} params.account   // 上传账号
     * @param {string} params.comments  // 上传时备注信息
     * @param {string} params.softwareVersion // SDK版本
     */
    upload(params: LogUploadParam): Promise<unknown>;
    /**
     * 将关键信息进行隐藏
     *
     * @param  content
     * @returns
     */
    private transformContent;
}
export default Log;
