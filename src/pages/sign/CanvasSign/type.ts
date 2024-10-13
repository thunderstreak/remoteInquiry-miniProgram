import { Ref } from 'react'
import Taro from '@tarojs/taro'
import { CanvasTouch } from '@tarojs/components/types/common'

/**
 * 签名组件 ref context
 */
export interface CanvasSignContext {
  handleClear: () => void;
  handleSaveImage: () => Promise<ToDataURLResult>;
}

/**
 * CanvasSign.props 参数类型
 */
export interface CanvasSignProps {
  className?: string;
  ref?: Ref<CanvasSignContext>;
  onChange?: (
    type: 'ON_START' | 'ON_MOVE' | 'ON_END',
    data: CanvasTouch
  ) => void;
  onReady?: (res: Pick<CanvasSignState, 'width' | 'height'>) => void;
}

/**
 * canvas 导入图片结果
 */
export interface ToDataURLResult {
  tempFilePath: string;
  errMsg: string;
}

export interface CanvasSignState {
  canvas: Taro.Canvas | null;
  width: number;
  height: number;
}
