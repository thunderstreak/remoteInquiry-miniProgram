import { CustomLoggerConfig, LogUploadParam } from '../type/index';
declare class CustomLogger {
    private homePath;
    private fs;
    private fileMaxCount;
    private fileMaxSize;
    private seq;
    private id;
    private dirName;
    private suffix;
    private encoding;
    private zipFilePath;
    private wxLogger;
    private uploadUrl;
    private dir;
    private filePath;
    private handleWatchFile;
    static instance: CustomLogger;
    constructor(config: CustomLoggerConfig, logger: any);
    static getInstance(config: any, logger: any): CustomLogger;
    /**
     * 设置Log Server服务器地址
     *
     * @public
     * @param { string } logServer Log服务器地址
     */
    setLogServer(logServer: any): void;
    log(title: any, content: any, ...rest: any[]): void;
    info(title: any, content: any, ...rest: any[]): void;
    debug(title: any, content: any, ...rest: any[]): void;
    warn(title: any, content: any, ...rest: any[]): void;
    /**
     * 上传日志
     *
     * @param {Object} params
     * @param {string} params.displayName // 上传文件名
     * @param {string} params.account   // 上传账号
     * @param {string} params.comments  // 上传时备注信息
     * @param {string} params.softwareVersion // SDK版本
     */
    upload(params: LogUploadParam): Promise<unknown>;
    private init;
    /**
     * 创建本地日志目录
     */
    private createDir;
    /**
     * 读取本地日志，获取目前存储的文件最大序号
     *
     * @returns
     */
    private readDir;
    /**
     * 创建日志文件
     *
     */
    private createFile;
    /**
     * 监听文件大小
     *
     */
    private watchFile;
    private putLog;
    /**
     * 追加日志
     *
     * @param {*} data 日志内容
     */
    private appendLog;
    /**
     * 生成压缩文件
     *
     */
    private createZip;
    /**
     * 压缩日志文件目录
     *
     * @returns
     */
    private generateZip;
    /**
     * 递归读取文件buffer存储到zip中
     *
     * @param {*} zip
     * @param {*} dirPath
     */
    private generateZipBlobAsync;
    /**
     * 获取文件信息
     *
     * @param {*} path
     * @returns
     */
    private getFileInfo;
    /**
     * 列表转对象排序
     *
     * @param {*} list
     * @returns
     */
    private listToDict;
    /**
     * 判断文件/目录是否存在
     *
     * @param {*} path  日志路径
     * @returns
     */
    private exists;
    /**
     * 格式化日志数据
     *
     * @param {*} type
     * @param {*} title
     * @param {*} content
     * @param {*} rest
     * @returns
     */
    private formatData;
    /**
     * 删除目录
     *
     * @param {*} dir
     */
    private deleteDir;
    /**
     * 删除文件
     *
     * @param {*} path
     */
    private deleteFile;
}
export default CustomLogger;
