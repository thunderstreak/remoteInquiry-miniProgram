export type TEncoding = 'ascii' | 'base64' | 'binary' | 'hex' | 'ucs2' | 'ucs-2' | 'utf16le' | 'utf-16le' | 'utf-8' | 'utf8' | 'latin1';
/**
 * Logger config
 *
 * @property { boolean } isConsole 是否打印console.log
 * @property { boolean } isLogger 是否写入到本地log文件
 * @property { boolean } isInit 是否初始化打印系统信息
 * @property { LogType } type 日志类型
 */
export interface ILoggerConfig {
    isConsole?: boolean;
    isLogger?: boolean;
    isInit?: boolean;
    type?: LogType;
}
/**
 * 上传日志内容
 *
 * @property { string } comments 内容
 * @property { string } account 账号
 */
export interface UploadLogContent {
    comments?: string;
    account?: string;
}
/**
 * 日志类型
 *
 * @enum
 * @param  DEFAULT 0 - 微信LogManager
 * @param  CUSTOM 1 - XYLINK LogManager
 *
 */
export declare enum LogType {
    DEFAULT = 0,
    CUSTOM = 1
}
export type TLogType = `${LogType}`;
/**
 * 布局模式
 *
 * @enum
 * @param  AUTO auto 自动布局，布局内容由sdk内部实现
 * @param  CUSTOM custom 自定义布局，第三方根据自己业务实现
 */
export declare enum LayoutMode {
    AUTO = "auto",
    CUSTOM = "custom"
}
/**
 * 上传日志参数
 *
 * @param {string} params.displayName // 上传文件名
 * @param {string} params.account   // 上传账号
 * @param {string} params.comments  // 上传时备注信息
 * @param {string} params.softwareVersion // SDK版本
 */
export interface LogUploadParam extends UploadLogContent {
    displayName?: string;
    softwareVersion?: string;
}
/**
 * 自定义日志 参数
 *
 * @param { number } fileMaxCount 最多生成的日志文件数量
 * @param { number } fileMaxSize 每个日志文件最大存储
 */
export interface CustomLoggerConfig {
    fileMaxCount?: number;
    fileMaxSize?: number;
}
