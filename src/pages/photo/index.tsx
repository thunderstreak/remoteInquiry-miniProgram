import { useCallback, useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import Step from '@/components/Step'
import { PhotoState } from '@/pages/photo/type'
import NavHeader from '@/components/NavHeader'
import UploadImg from './component/UploadImg'
import Sign from './component/Sign'
// import './index.less'

export default function Index() {
  const [state, setState] = useState<PhotoState>({
    step: 1,
    markUrl: '',
    nameUrl: '',
    timeUrl: ''
  })
  const tempUrl = useMemo(() => {
    const { markUrl, nameUrl, timeUrl, step } = state
    return { 1: '', 2: markUrl, 3: nameUrl, 4: timeUrl }[step]
  }, [state])

  const handleNext = useCallback(
    (res) => {
      const { type, data } = res
      switch (type) {
        case 'UPLOAD':
          console.log(data)
          break
      }
      if (state.step < 4) {
        setState((v) => ({ ...v, step: state.step + 1 }))
      } else {
        console.log('上传')
      }
    },
    [state.step]
  )
  const handlePrev = useCallback(() => {
    setState((v) => ({ ...v, step: state.step - 1 }))
  }, [state.step])

  useEffect(() => {
    Taro.eventCenter.on('SIGN_REMARK', (res) => {
      console.log(res)
      setState((v) => ({ ...v, markUrl: res.url }))
    })
    Taro.eventCenter.on('SIGN_NAME', (res) => {
      console.log(res)
      setState((v) => ({ ...v, nameUrl: res.url }))
    })
    Taro.eventCenter.on('SIGN_TIME', (res) => {
      console.log(res)
      setState((v) => ({ ...v, timeUrl: res.url }))
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
        <Step active={state.step} className="mx-3 mt-6 mb-4" />
        {state.step === 1 ? (
          <UploadImg onNext={handleNext} />
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
