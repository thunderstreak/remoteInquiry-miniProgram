import { LayoutMode, LogType } from '../type/index';
/**
 * 视频质量(分辨率)
 *
 * @enum
 * @property {string} normal 小屏： 180p 30帧 320_180 256kb
 * @property {string} high 大屏 ： 360p 30帧 640_360  1Mb
 * @property {string} hd
 */
export declare const videoQuality: {
    normal: number;
    high: number;
    hd: number;
};
/**
 * 带宽
 *
 * @enum
 * @property {string} normal 256
 * @property {string} high 900
 * @property {string} hd 1200
 */
export declare const videoBandwidth: {
    normal: number;
    high: number;
    hd: number;
};
export declare const DEVICE_TYPE = 10;
export declare const NETWORK_TYPE_MAP: {
    none: number;
    wifi: number;
    '3g': number;
    wired: number;
    '2g': number;
    '4g': number;
    wwan: number;
    '3g_china_mobile': number;
};
/**
 * 模板对应位置类型
 *
 * @enum
 * @property {PEOPLE} '0'
 * @property {CONTENT} '1' 共享画面
 */
export declare const ROSTER_TYPE_ID: {
    PEOPLE: string;
    CONTENT: string;
};
/**
 * 模板对应位置类型
 *
 * @enum
 * @property {LOCAL} LOCAL 本地
 * @property {CONTENT} CONTENT 共享画面
 */
export declare const TEMPLATE_TYPE: {
    LOCAL: string;
    CONTENT: string;
};
/**
 * 分辨率
 */
export declare const RESOLUTION_MAP: {
    1: {
        resolution: string;
        frameRate: string;
        bandwidth: number;
        priority: number;
    };
    2: {
        resolution: string;
        frameRate: string;
        bandwidth: number;
        priority: number;
    };
    3: {
        resolution: string;
        frameRate: string;
        bandwidth: number;
        priority: number;
    };
};
/**
 * 布局方向
 *
 * @enum
 * @property {HORIZONTAL} HORIZONTAL 横屏
 * @property {VERTICAL} VERTICAL 竖屏
 */
export declare const ORIENTATION: {
    HORIZONTAL: string;
    VERTICAL: string;
};
/**
 * streamAssignment
 *
 */
export declare const DEFAULT_STREAM_ASSIGNMENT: {
    type: string;
    frameRate: number;
    payloadType: string;
    resolution: string;
    bandwidth: number;
};
/**
 * 模式
 *
 * @property TRTC 腾讯模式
 * @property RTMP rtmp自建模式
 */
export declare const RTMP_MODE: {
    TRTC: number;
    RTMP: number;
};
/**
 *  正常退会错误码
 */
export declare const NORMAL_CLOSE_CODE = 3999;
/**
 * roster 级别
 * 0-6 值越小，级别越高
 */
export declare const ROSTER_TYPE_MAP: {
    0: string;
    1: string;
    2: string;
    3: string;
    4: string;
    5: string;
    6: string;
};
/**
 * SDK 最低支持微信版本号
 * 2.19.2
 */
export declare const MINIMUM_SUPPORTED_VERSION = "2.19.1";
export declare const MAX_CUSTOM_MESSAGE_LEN = 1846666;
export declare const MAX_CUSTOM_MESSAGE_LOG_LEN = 13333;
export declare const DEFAULT_CLIENT_CONFIG: {
    layoutMode: LayoutMode;
    server: string;
    logServer: string;
    report: boolean;
    orientation: string;
    extId: string;
    appId: string;
    container: {
        offset: number[];
    };
    screenOn: boolean;
    logType: LogType;
};
/**
 * 会议埋点 消息类型
 */
export declare const REPORT_CATEGORY: {
    CONFSTATUS: string;
    CONFOPERATION: string;
    MSGCALLBACK: string;
};
/**
 * SDK功能控制开关
 */
export declare const DEFAULT_FEATURE_CONFIG: {
    enableMeetingInvite: boolean;
    enableLayoutAvatar: boolean;
    enableBandwidthSetting: boolean;
};
/**
 * 日志中需要隐藏的关键词
 */
export declare const HIDE_KEY_INFOS: string[];
/**
 * 分辨率
 */
export declare const StreamResolution: {
    RS180: number;
    RS360: number;
    RS720: number;
};
/**
 * 不同模式下的分辨率等配置
 *
 */
export declare const MEDIA_CONFIG: {
    [x: number]: {
        maxVideoHeight: number;
        maxResolution: string;
        maxBandwidth: number;
        pusherConfig: {
            maxBitrate: number;
            minBitrate: number;
            mode: string;
        };
    };
};
/**
 * 默认发送最大分辨率
 */
export declare const DEFAULT_VIDEO_PROFILE: {
    maxResPvtx: number;
};
