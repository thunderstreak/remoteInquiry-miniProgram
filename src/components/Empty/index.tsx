import { Image, View } from '@tarojs/components'
import React, { memo } from 'react'
import { EmptyProps } from './type'

const URL = ''
const MSG = '暂无数据'

const Empty: React.FC<EmptyProps> = (props) => {
  const { url = URL, msg = MSG, className, imgClassName = 'w-[120px] h-[120px]' } = props


  return (
    <View
      className={`flex-1 w-full h-full flex flex-col justify-center items-center bg-white ${className}`}
    >
      <Image src={url} mode="aspectFill" className={imgClassName} />
      <View className="text-[14px] text-black font-normal text-center">
        {msg}
      </View>
    </View>
  )
}

export default memo(Empty)
