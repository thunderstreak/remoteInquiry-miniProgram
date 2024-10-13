import React, { memo, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { Image, View } from '@tarojs/components'
import { Button, WaterMark } from '@nutui/nutui-react-taro'
import { SignProps } from './type'

const STEP_MPA = {
  1: '',
  2: 'SIGN_MARK',
  3: 'SIGN_NAME',
  4: 'SIGN_TIME'
}
const UploadImg: React.FC<SignProps> = (props) => {
  const handlePrev = useCallback(() => {
    props.onPrev?.()
  }, [props])

  const handleNext = useCallback(() => {
    if (props.url) {
      props.onNext?.({ type: STEP_MPA[props.step] })
    } else {
      Taro.showToast({ title: '请点击【签字】按钮', icon: 'none' })
    }
  }, [props])

  const handleSign = useCallback(() => {
    Taro.navigateTo({ url: `/pages/sign/index?type=${STEP_MPA[props.step]}` })
  }, [props.step])

  return (
    <View className="px-3 pb-6 flex-1 flex flex-col">
      <WaterMark content="千名千探" />
      <View className="flex-1 pb-4 flex flex-col">
        <View className="border-dashed border-[2px] border-[#2766CF] rounded-[12px] flex-1 flex-center">
          {props.url && <Image src={props.url} />}
        </View>
      </View>
      <View className="flex-shrink-0 flex-center gap-2">
        <Button
          className="!h-[44px] w-[110px] rounded-full !text-white !bg-[#2766CF] !border-0"
          onClick={handlePrev}
        >
          上一步
        </Button>
        <Button
          className="!h-[44px] w-[110px] rounded-full !text-white !bg-[#2766CF] !border-0"
          onClick={handleSign}
        >
          签字
        </Button>
        <Button
          disabled={!props.url}
          className={`w-[110px] !h-[44px] rounded-full !text-white ${
            props.url ? '!bg-[#2766CF] !border-0' : '!bg-[#999999]'
          }`}
          onClick={handleNext}
        >
          {props.step === 4 ? '上传' : '下一步'}
        </Button>
      </View>
    </View>
  )
}
export default memo(UploadImg)
