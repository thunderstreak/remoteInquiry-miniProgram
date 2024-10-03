import React, { useCallback, useEffect, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Button, View } from '@tarojs/components'
import { WaterMark } from '@nutui/nutui-react-taro'
import NavHeader from '@/components/NavHeader'

import { CanvasSign } from './CanvasSign'
import { CanvasSignContext } from './CanvasSign/type'
// import './index.less'

const Index: React.FC = () => {
  const router = useRouter()
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
    Taro.eventCenter.trigger(router.params.type ?? '', {
      url: result.tempFilePath
    })
    Taro.navigateBack({ delta: 1 })
  }, [router.params.type])

  const onClear = useCallback(() => {
    signRef.current?.handleClear()
  }, [])

  // const onCancel = useCallback(() => {
  //   Taro.navigateBack({ delta: 1 })
  // }, [])

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
    <View className="h-full w-full flex flex-col relative">
      <WaterMark fullPage content="千名千探" />
      <View className="flex-shrink-0 flex flex-col justify-between bg-[#2766CF] h-[24px]">
        <View className="flex-shrink-0">
          <NavHeader
            className="pb-0"
            iconClassName="!w-3 !h-3 top-[5px]"
            title={<View className="text-[12px]">照片签字</View>}
          />
        </View>
      </View>
      <View className="flex-1 border-dashed border-[1px] border-[#2766CF] m-[6px] rounded overflow-hidden">
        <CanvasSign
          className="absolute top-0 left-0 right-0 bottom-0"
          ref={signRef}
          onChange={handleChange}
          onReady={handleReady}
        />
      </View>
      <View className="w-full flex-center gap-[10px] pb-[5px]">
        <Button
          className="bg-[#2E6EF4] rounded-full border-0 text-white w-[90px] flex-shrink-0"
          onClick={onClear}
        >
          清除重签
        </Button>
        <Button
          className="bg-[#2E6EF4] rounded-full border-0 text-white w-[90px] flex-shrink-0"
          onClick={onSubmit}
        >
          确认签字
        </Button>
      </View>
    </View>
  )
}

export default Index
