import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { Canvas } from '@tarojs/components'
import Taro, { CanvasContext, useReady } from '@tarojs/taro'

import { CanvasTouchEvent } from '@tarojs/components/types/common'
import { CanvasSignProps, CanvasSignState } from './type'

// export { CanvasSignContext, ToDataURLResult, CanvasSignProps } from './type'

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
  const [rect, setRect] = useState({ width: 0, height: 0 })
  const state = useRef<CanvasSignState>({ canvas: null, width: 0, height: 0 })
  // 绘图画布引用
  const context = useRef<Taro.CanvasContext>()
  // 绘制轨迹信息
  const lineInfo = useRef({ startX: 0, startY: 0 })

  const canvasStart = useCallback(
    (e: CanvasTouchEvent) => {
      e.preventDefault()
      const changedTouches = e.changedTouches[0]
      props?.onChange?.('ON_START', changedTouches)

      const { x, y } = changedTouches
      lineInfo.current.startX = x
      lineInfo.current.startY = y
      context.current?.beginPath()
    },
    [props]
  )

  const canvasMove = useCallback(
    (e: CanvasTouchEvent) => {
      e.preventDefault()
      const changedTouches = e.changedTouches[0]
      props?.onChange?.('ON_MOVE', changedTouches)

      const { x, y } = changedTouches
      context.current?.moveTo(lineInfo.current.startX, lineInfo.current.startY)
      context.current?.lineTo(x, y)
      context.current?.stroke()
      lineInfo.current.startX = x
      lineInfo.current.startY = y
    },
    [props]
  )
  const canvasEnd = useCallback(
    (e: CanvasTouchEvent) => {
      e.preventDefault()
      const changedTouches = e.changedTouches[0]
      props?.onChange?.('ON_END', changedTouches)
    },
    [props]
  )

  const handleClear = useCallback(() => {
    context.current?.clearRect(0, 0, state.current.width, state.current.height)
  }, [])

  const handleSaveImage = useCallback(async () => {
    return await toDataURL(state.current.canvas)
  }, [])

  useReady(() => {
    setTimeout(() => {
      const query = Taro.createSelectorQuery()
      Taro.showToast({ title: 'ready' })
      query
        .select('#myCanvas')
        .fields({ node: true, size: true })
        .exec((res) => {
          const canvas = res[0].node
          if (!canvas) {
            return
          }

          const { windowWidth: width, windowHeight: height } =
            Taro.getSystemInfoSync()
          const rectUnit = { width, height }
          state.current = { ...rectUnit, canvas }

          setRect({ width, height })

          props.onReady?.(rectUnit)

          canvas.width = width
          canvas.height = height

          const ctx: CanvasContext = canvas.getContext('2d')
          // todo canvas设置背景色需要先绘制到另外一个canvas上并保存，否则会影响页面的颜色
          // ctx.fillStyle = '#c1c1c1' // 设置填充颜色
          // ctx.fillRect(0, 0, canvas.width, canvas.height) // 绘制一个覆盖整个Canvas的矩形

          ctx.strokeStyle = '#000000'
          ctx.lineWidth = 4
          ctx.lineCap = 'round'
          ctx.lineJoin = 'round'

          context.current = ctx
        })
    }, 500)
  })

  useImperativeHandle(ref, () => ({ handleClear, handleSaveImage }))

  return (
    <Canvas
      style={{ width: rect.width, height: rect.height }}
      className={`${props.className}`}
      canvasId="myCanvas"
      id="myCanvas"
      disableScroll
      type="2d"
      onTouchStart={canvasStart}
      onTouchMove={canvasMove}
      onTouchEnd={canvasEnd}
    />
  )
})
