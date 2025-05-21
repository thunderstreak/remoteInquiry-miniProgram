import { useCallback, useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import Step from '@/components/Step'
import { PhotoState } from '@/pages/photo/type'
import NavHeader from '@/components/NavHeader'
import { useSocket } from '@/utils/socket'
import { UploadResponse } from '@/@type/common'
import { NextParams as UploadNextParams } from '@/pages/photo/component/UploadImg/type'
import { NextParams as SignNextParams } from '@/pages/photo/component/Sign/type'
import UploadImg from './component/UploadImg'
import Sign from './component/Sign'
// import './index.less'

export default function Index() {
  const { handleSend } = useSocket()
  const [state, setState] = useState<PhotoState>({
    step: 1,
    end: 0,
    photo: [],
    markUrl: '',
    nameUrl: '',
    timeUrl: ''
  })
  const tempUrl = useMemo(() => {
    const { markUrl, nameUrl, timeUrl, step } = state
    return { 1: '', 2: markUrl, 3: nameUrl, 4: timeUrl }[step]
  }, [state])

  // const photoList = useMemo(() => {
  //   return [...state.photo, state.markUrl, state.nameUrl, state.timeUrl].filter(x => x)
  // }, [state.markUrl, state.nameUrl, state.photo, state.timeUrl])

  // 发送图片
  const handleSendImages = useCallback(() => {
    const data = {
      photo: state.photo,
      markUrl: state.markUrl,
      nameUrl: state.nameUrl,
      timeUrl: state.timeUrl
    }
    handleSend({ type: 'ON_UPLOAD', data })
  }, [handleSend, state.markUrl, state.nameUrl, state.photo, state.timeUrl])

  const handleNext = useCallback(
    (res: UploadNextParams & SignNextParams) => {
      const { type, data } = res
      switch (type) {
        case 'UPLOAD':
          const photo = data.map((x) => x.url)
          setState((v) => ({ ...v, photo, end: photo.length ? 1 : 0 }))
          // handleSend({ type: 'ON_UPLOAD', data: photo })
          break
      }
      if (state.step < 4) {
        setState((v) => ({ ...v, step: state.step + 1 }))
      } else {
        handleSend({ type: 'ON_UPLOAD_END', data: { time: Date.now() } })
        Taro.navigateBack({ delta: 1 })
      }
    },
    [handleSend, state.step]
  )
  const handlePrev = useCallback(() => {
    setState((v) => ({ ...v, step: state.step - 1 }))
  }, [state.step])

  useEffect(() => {
    handleSendImages()
  }, [handleSendImages])

  useEffect(() => {
    // 签备注
    Taro.eventCenter.on('SIGN_MARK', (res: UploadResponse) => {
      const { url } = res
      setState((v) => ({ ...v, markUrl: url, end: url ? 2 : 0 }))
    })
    // 签名
    Taro.eventCenter.on('SIGN_NAME', (res: UploadResponse) => {
      const { url } = res
      setState((v) => ({ ...v, nameUrl: url, end: url ? 3 : 0 }))
    })
    // 签时间
    Taro.eventCenter.on('SIGN_TIME', (res: UploadResponse) => {
      const { url } = res
      setState((v) => ({ ...v, timeUrl: url, end: url ? 4 : 0 }))
    })
  }, [])

  return (
    <View className="h-full w-full flex flex-col bg-[#2766CF]">
      <View className="flex-shrink-0 flex flex-col justify-between">
        <View className="flex-shrink-0">
          <NavHeader title="添加照片" />
        </View>
      </View>
      <View className="flex-1 flex flex-col bg-white">
        <Step active={state.step} fulfill={state.end} className="mx-3 mt-6 mb-4" />
        {state.step === 1 ? (
          <UploadImg onNext={handleNext} value={state.photo} />
        ) : (
          <Sign
            step={state.step}
            url={tempUrl}
            onNext={handleNext}
            onPrev={handlePrev}
          />
        )}
      </View>
    </View>
  )
}
