import { View } from '@tarojs/components'
import React, { memo, useCallback } from 'react'
import { NavHeaderProps } from '@/components/NavHeader/type'
import { useStatusHeight } from '@/hooks/useStatusHeight'
import { ArrowLeft } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'

const NavHeader: React.FC<NavHeaderProps> = (props) => {
  const { title = '' } = props
  const {
    menuButtonBounding: { top }
  } = useStatusHeight()
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
  return (
    <View
      className={`relative transition-all duration-500 pb-[10px] ${props.className}`}
      style={{ paddingTop: `${top}px` }}
    >
      <ArrowLeft
        className={`block w-[20px] h-[20px] !absolute left-[20px] text-white ${props.iconClassName}`}
        onClick={handleToBack}
      />
      <View className="w-full text-center text-[17px] font-medium text-white">
        {title || ''}
      </View>
    </View>
  )
}

export default memo(NavHeader)
