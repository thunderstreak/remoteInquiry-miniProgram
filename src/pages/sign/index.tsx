import React, { useCallback, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'
import { Button, View } from '@tarojs/components'
import { CanvasSign, CanvasSignContext } from './CanvasSign'

import './index.less'

const Index: React.FC = () => {
  const rect = useRef({ width: 0, height: 0 })
  const socketTask = useRef<Taro.SocketTask | null>(null)
  const signRef = useRef<CanvasSignContext>(null)
  // const router = useRouter()

  // 确认签名完成
  const onSubmit = useCallback(async () => {
    const result = await signRef.current?.handleSaveImage()
    if (!result) {
      return console.error('签名失败')
    }

    // 用事件总线把导出的签名图发射出去
    // Taro.eventCenter.trigger(router.params.type || '', {
    //   url: result.tempFilePath
    // })
    Taro.navigateBack({ delta: 1 })
  }, [])

  const onClear = useCallback(() => {
    signRef.current?.handleClear()
  }, [])

  const onCancel = useCallback(() => {
    Taro.navigateBack({ delta: 1 })
  }, [])

  // 签名轨迹开始
  const handleChange = useCallback((type: 'ON_START' | 'ON_MOVE', val) => {
    console.log(val)
    const data = JSON.stringify({ type, data: val })
    socketTask.current?.send({ data })
  }, [])

  // 签名组件初始化完成
  const handleReady = useCallback(({ width, height }) => {
    console.log(width, height)
    rect.current = { width, height }
  }, [])

  // 初始化建立wss链接
  useEffect(() => {
    // 通过 WebSocket 连接发送数据。需要先 connectSocket，并在 onSocketOpen 回调之后才能发送。
    Taro.connectSocket({ url: 'wss://echo.websocket.org', header: {} }).then(
      (task) => {
        task.onOpen((res) => {
          console.log(res)

          socketTask.current = task

          const data = JSON.stringify({ type: 'ON_READY', data: rect.current })
          socketTask.current?.send({ data })
        })
        task.onError((err) =>
          Taro.showToast({ title: err.errMsg, icon: 'none' })
        )
        task.onMessage((res) => {
          console.log(res.data)
        })
      }
    )
    return () => {
      socketTask.current?.close({
        code: 1000,
        reason: '结束链接',
        complete: () => {
          console.log('链接已关闭')
        }
      })
      socketTask.current = null
    }
  }, [])

  return (
    <View className="h-full relative">
      <CanvasSign ref={signRef} onChange={handleChange} onReady={handleReady} />
      <View className="absolute bottom-5 left-0 right-0 flex items-center justify-between">
        <Button className="btn" type="primary" plain onClick={onClear}>
          重置
        </Button>
        <Button className="btn" type="primary" plain onClick={onCancel}>
          取消
        </Button>
        <Button className="btn" type="primary" onClick={onSubmit}>
          提交
        </Button>
      </View>
    </View>
  )
}

export default Index
