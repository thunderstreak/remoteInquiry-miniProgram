import { View } from '@tarojs/components'
import React, { memo, useCallback } from 'react'
import { NavHeaderProps } from '@/components/NavHeader/type'
import { useStatusHeight } from '@/hooks/useStatusHeight'
import { ArrowLeft } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'

const NavHeader: React.FC<NavHeaderProps> = (props) => {
  const { title = '', back = true, className = '', iconClassName = '' } = props
  const {
    menuButtonBounding: { top }
  } = useStatusHeight()
  const handleToBack = useCallback(() => {
    if (typeof back === 'function') {
      return back()
    }
    const pages = Taro.getCurrentPages()
    if (pages.length > 1 && Taro.getEnv() === 'WEAPP') {
      Taro.navigateBack()
    } else {
      Taro.switchTab({ url: '/pages/home/index' })
    }
  }, [back])
  return (
    <View
      className={`relative transition-all duration-500 pb-[10px] ${className}`}
      style={{ paddingTop: `${top + 6}px` }}
    >
      {back && (
        <ArrowLeft
          className={`block w-[20px] h-[20px] !absolute z-10 left-[20px] text-white ${iconClassName}`}
          onClick={handleToBack}
        />
      )}
      <View className="w-full text-center text-[17px] font-medium text-white">
        {title || ''}
      </View>
    </View>
  )
}

export default memo(NavHeader)
