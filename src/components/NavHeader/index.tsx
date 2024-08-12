import { Image, View } from '@tarojs/components'
import React, { memo, useCallback } from 'react'
import { NavHeaderProps } from '@/components/NavHeader/type'
import { useStatusHeight } from '@/hooks/useStatusHeight'
import Taro from '@tarojs/taro'

const NavHeader: React.FC<NavHeaderProps> = (props) => {
  const { isRadius = false, title = '' } = props
  const { menuButtonBounding: { top } } = useStatusHeight()
  const handleToBack = useCallback(() => {
    if (props.back) {
      return props.back
    }
    const pages = Taro.getCurrentPages()
    if (pages.length > 1 && Taro.getEnv() === 'WEAPP') {
      Taro.navigateBack()
    } else {
      Taro.switchTab({ url: '/pages/home/index' })
    }
  }, [props.back])
  return <View className="relative transition-all duration-500 flex justify-between pb-[10px]"
    style={{ paddingTop: `${top}px` }}
  >
    <View>
      {isRadius ? <Image
        src="https://obs.prod.ubanquan.cn/obs_717104887800001718198713_pre$prod-ubq"
        className="block w-[28px] h-[28px] absolute left-[20px]"
        style={{ top: `${top + 2}px` }}
        onClick={handleToBack}
      /> : <Image
        src="https://obs.prod.ubanquan.cn/obs_717104887800001718093861_pre$prod-ubq"
        className="block w-[20px] h-[20px] absolute left-[20px]"
        style={{ top: `${top + 6}px` }}
        onClick={handleToBack}
      />}
    </View>
    <View className="pt-1 w-full h-[24px] text-center text-[17px] font-medium">{title || ''}</View>
  </View>
}

export default memo(NavHeader)
