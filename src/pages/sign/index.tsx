import React, { useCallback, useEffect, useMemo, useRef } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Button, View } from '@tarojs/components'
import { WaterMark } from '@nutui/nutui-react-taro'
import NavHeader from '@/components/NavHeader'
// import config from '@/config/index'
import { OnNoticeData } from '@/@type/response'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '@/store/slice/user'
import { useSocket } from '@/utils/socket'
import CommonApi from '@/api/common'
import dayjs from 'dayjs'

import { CanvasSign } from './CanvasSign'
import { CanvasSignContext } from './CanvasSign/type'

// import './index.less'

const Index: React.FC = () => {
  const { handleSend } = useSocket()
  const userInfo = useSelector(selectUserInfo)
  const router = useRouter()
  const rect = useRef({ width: 0, height: 0 })
  const signRef = useRef<CanvasSignContext>(null)
  // const router = useRouter()

  const title = useMemo(() => {
    const type = router.params.type
    // 文书名称
    const name = router.params.name || ''
    let str = ''
    switch (type) {
      case 'SIGN_MARK':
      case 'ON_SIGN_MARK':
        str = '通知签备注'
        break
      case 'SIGN_NAME':
      case 'ON_SIGN_NAME':
        str = '通知签名'
        break
      case 'SIGN_TIME':
      case 'ON_SIGN_TIME':
        str = '通知签日期'
        break
      default:
        str = '签字'
        break
    }
    return name ? `${str}（${name}）` : str
  }, [router.params.type])

  const signTemplate = useMemo(() => {
    const type = router.params.type
    const { data } = Taro.getStorageSync<OnNoticeData>('NOTICE_SIGN_MARK')
    switch (type) {
      case 'SIGN_NAME': // 签名
      case 'ON_SIGN_NAME': // 签名
        const name = userInfo.userName.split('') || []
        if (name.length > 4) {
          return <View className="flex-1 h-full flex-center text-[32px]">
            <View className="w-full h-full flex-center text-[#CECECE] text-center">{name}</View>
          </View>
        }
        return name.map((x, i) => <View key={i} className="flex-1 h-full flex-center border-solid border-[1px] border-[#CECECE] bg-[#efefef] text-[72px] relative">
          <View className="absolute h-full w-[1px] left-[calc(50%-1px)] bg-[#CECECE]" />
          <View className="absolute w-full h-[1px] top-[calc(50%+1px)] bg-[#CECECE]" />
          <View className="absolute top-0 left-0 right-0 bottom-0 m-auto w-full h-full flex-center text-[#CECECE]">{x}</View>
        </View>)
      case 'SIGN_TIME': // 签日期
      case 'ON_SIGN_TIME': // 签日期
        return <View className="flex-1 h-full flex-center text-[52px] bg-[#efefef]">
          <View className="w-full h-full flex-center text-[#CECECE]">{dayjs().format('YYYY.MM.DD')}</View>
        </View>
      // case 'SIGN_MARK': // 签备注
      case 'ON_SIGN_MARK': // 签备注
        if (data?.templateName === '询问笔录') {
          return <View className="flex-1 h-full flex-center text-[32px]">
            <View className="w-full h-full flex-center text-[#CECECE] text-center">{Taro.getStorageSync<string>('REMARK_TEMPLATE')}</View>
          </View>
        }
        return null
    }
  }, [router.params.type, userInfo.userName])

  // 确认签名完成
  const onSubmit = useCallback(async () => {
    const result = await signRef.current?.handleSaveImage()
    if (!result) {
      return console.error('签名失败')
    }
    // Taro.uploadFile({
    //   url: `${process.env.TARO_APP_API}/upload/v1/minio/fileUpload`,
    //   filePath: result.tempFilePath,
    //   name: 'file',
    //   header: { 'Content-Type': 'multipart/form-data', ...config.headers }
    // })
    CommonApi.fileUpload(result.tempFilePath).then((res) => {
      const { data } = res
      const type = router.params.type
      console.log('type===>', type)
      switch (type) {
        // 用事件总线把导出的签名图发射出去 SIGN_MARK SIGN_NAME SIGN_TIME
        case 'SIGN_MARK':
        case 'SIGN_NAME':
        case 'SIGN_TIME':
          Taro.eventCenter.trigger(type ?? '', data)
          handleSend({ type: `ON_${type}`, data })
          break
        case 'ON_SIGN_NAME': // 返回接受到的通知签名
        case 'ON_SIGN_TIME': // 返回接受到的通知签日期
        case 'ON_SIGN_MARK': // 返回接受到的通知签备注
          handleSend({ type, data })
          break
      }

      Taro.navigateBack({ delta: 1 })
    }).catch(err => {
      Taro.showToast({ title: err })
    })
  }, [handleSend, router.params.type])

  const onClear = useCallback(() => {
    signRef.current?.handleClear()
    handleSend({ type: 'ON_SIGN_CLEAR', data: { time: Date.now() } })
  }, [handleSend])

  // const onCancel = useCallback(() => {
  //   Taro.navigateBack({ delta: 1 })
  // }, [])

  // 签名轨迹开始
  const handleChange = useCallback(
    (type: 'ON_START' | 'ON_MOVE' | 'ON_END', val) => {
      const data = { type, data: val }
      handleSend(data)
    },
    [handleSend]
  )

  // 发送签名事件
  const handleSendSign = useCallback(() => {
    if (rect.current.height && rect.current.width) {
      const type = router.params.type
      console.log('type', type)
      switch (type) {
        case 'SIGN_MARK': // 上传照片中的签备注
        case 'SIGN_NAME':// 上传照片中的签名
        case 'SIGN_TIME':// 上传照片中的签时间
        case 'ON_SIGN_NAME': // 发送通知签名准备
        case 'ON_SIGN_TIME': // 发送通知签时间准备
        case 'ON_SIGN_MARK': // 发送通知签备注准备
          const suffix = type.replace(/(SIGN_|ON_SIGN_)/g, '')
          handleSend({ type: `ON_READY_${suffix}`, data: rect.current })
          break
      }
    }
  }, [handleSend, router.params.type])

  // 返回通知
  const handleBack = useCallback(() => {
    handleSend({ type: 'ON_SIGN_BACK', data: { time: Date.now() } })
    Taro.navigateBack()
  }, [handleSend])

  // 签名组件初始化完成
  const handleReady = useCallback(
    ({ width, height }) => {
      rect.current = { width, height }
      handleSendSign()
    },
    [handleSendSign]
  )

  useEffect(() => {}, [])

  return (
    <View className="h-full w-full flex flex-col relative">
      <WaterMark fullPage content="千名千探" />
      <View className="flex-shrink-0 flex flex-col justify-between bg-[#2766CF] h-[24px]">
        <View className="flex-shrink-0 h-full">
          <NavHeader
            back={handleBack}
            className="!pb-0 !pt-0 z-20 h-full"
            iconClassName="!w-3 !h-3 top-[5px]"
            title={<View className="text-[12px] absolute top-0 bottom-0 left-0 right-0 flex-center">{title}</View>}
          />
        </View>
      </View>
      <View className="flex-1 flex flex-col border-dashed border-[1px] border-[#2766CF] m-[6px] rounded overflow-hidden">
        <View className="h-full p-2 flex-center gap-2">
          {signTemplate}

        </View>
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
