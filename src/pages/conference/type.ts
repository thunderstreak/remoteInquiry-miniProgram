import {
  IBulkRoster,
  LayoutInfo,
  LayoutMode,
  MeetingInfo,
  RosterObj
} from '@xylink/xy-mp-sdk'

export interface ConferenceStates {
  loading: boolean;
  pushUrl: string; // 推流地址
  isPushed: boolean; // 是否已完成推流
  videoMute: boolean; // 本地摄像头是否关闭
  audioMute: boolean; // 本地麦克风是否关闭
  localNetworkLevel: number; // 本地网络信号等级
  remoteNetworkLevel: Record<string, number>; // 远端网络信号等级
  onHold: boolean; // 是否在等候室
  isShowDetected: boolean; // 权限确认提示框
  roster?: RosterObj; //  会中roster信息
  layout?: LayoutInfo[]; // 布局对象
  meetingInfo?: MeetingInfo; // 会议信息
  bulkRoster?: IBulkRoster[]; // 会中所有终端信息
  callNumber?: string; // 会议号
  pageOption?: any; // 页面URL参数
  connected?: boolean; // 入会成功
  meetingTime?: string; // 会议时间
  layoutMode: LayoutMode; // 会议时间
}

export interface NewLayout extends LayoutInfo {
  networkLevel?: number;
  audioImg?: string;
  avatar?: string;
  networkLevelImage?: string;
}

export interface ConferenceProps {}

export interface ConferenceRouterParams {
  number: string;
  password: string;
  displayName: string;
  videoMute: boolean;
  audioMute: boolean;
}
