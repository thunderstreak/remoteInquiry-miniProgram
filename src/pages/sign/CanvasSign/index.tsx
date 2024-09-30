import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react'
import { Canvas } from '@tarojs/components'
import Taro, { CanvasContext, useReady } from '@tarojs/taro'

import { CanvasTouchEvent } from '@tarojs/components/types/common'
import { CanvasSignProps, CanvasSignState } from './type'

export { CanvasSignContext, ToDataURLResult, CanvasSignProps } from './type'

/**
 * 将 canvas 内容转换成 base64 字符串
 */
const toDataURL = async (canvas: CanvasSignState['canvas']) => {
  if (!canvas) {
    return { errMsg: 'canvas is null', tempFilePath: '' }
  }

  return Taro.canvasToTempFilePath({ canvas: canvas, fileType: 'png' })
}
// React.ForwardRefExoticComponent<Omit<CanvasSignProps, 'ref'> & React.RefAttributes<unknown>>
// React.ForwardRefExoticComponent<React.PropsWithoutRef<{}> & React.RefAttributes<unknown>>
export const CanvasSign = forwardRef((props: CanvasSignProps, ref) => {
  const state = useRef<CanvasSignState>({ canvas: null, width: 0, height: 0 })
  // 绘图画布引用
  const context = useRef<Taro.CanvasContext>()
  // 绘制轨迹信息
  const lineInfo = useRef({ startX: 0, startY: 0 })

  const canvasStart = useCallback((e: CanvasTouchEvent) => {
    e.preventDefault()
    props?.onChange?.('ON_START', e.changedTouches)

    const { x, y } = e.changedTouches[0]
    lineInfo.current.startX = x
    lineInfo.current.startY = y
    context.current?.beginPath()
  }, [props])

  const canvasMove = useCallback((e: CanvasTouchEvent) => {
    e.preventDefault()
    props?.onChange?.('ON_MOVE', e.changedTouches)

    const { x, y } = e.changedTouches[0]
    context.current?.moveTo(lineInfo.current.startX, lineInfo.current.startY)
    context.current?.lineTo(x, y)
    context.current?.stroke()
    lineInfo.current.startX = x
    lineInfo.current.startY = y
  }, [props])

  const handleClear = useCallback(() => {
    context.current?.clearRect(0, 0, state.current.width, state.current.height)
  }, [])

  const handleSaveImage = useCallback(async () => {
    const result = await toDataURL(state.current.canvas)
    console.log(result.tempFilePath)
    return result
  }, [])

  useReady(() => {
    const query = Taro.createSelectorQuery()

    query
      .select('#myCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        const canvas = res[0].node
        if (!canvas) {
          return
        }

        const { windowWidth: width, windowHeight: height } = Taro.getSystemInfoSync()
        const rect = { width, height }
        state.current = { ...rect, canvas }

        props.onReady?.(rect)

        canvas.width = width
        canvas.height = height

        const ctx: CanvasContext = canvas.getContext('2d')

        ctx.strokeStyle = '#000000'
        ctx.lineWidth = 4
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        context.current = ctx
      })
  })

  useImperativeHandle(ref, () => ({ handleClear, handleSaveImage }))

  return <Canvas
    className="h-full w-full"
    canvasId="myCanvas"
    id="myCanvas"
    disableScroll
    type="2d"
    onTouchStart={canvasStart}
    onTouchMove={canvasMove}
  />
})
