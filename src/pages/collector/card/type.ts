import { CameraContext } from "@tarojs/taro"

export interface CollectorCardState {
    cameraContext: CameraContext | null
    /** 是否打开闪光灯 */
    cameraFlash: 'auto' | 'off' | 'on' | 'torch'
    cameraUid: string
}