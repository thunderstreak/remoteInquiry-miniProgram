import { View } from '@tarojs/components'
import { Divider } from '@nutui/nutui-react-taro'
import React, { memo, useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import { Checklist } from '@nutui/icons-react-taro'
import { StepProps } from './type'

const Step: React.FC<StepProps> = (props) => {
  const { active = 1, fulfill = 0 } = props
  const [state] = useState({
    list: [
      { step: 1, label: '添加照片' },
      { step: 2, label: '照片备注' },
      { step: 3, label: '签署姓名' },
      { step: 4, label: '签署日期' }
    ]
  })

  useEffect(() => {
    if (active !== 1) {
      Taro.showToast({
        title: '请点击【签字】按钮',
        icon: 'none',
        duration: 2000
      })
    }
  }, [active])

  return (
    <View className={`relative h-[76px] ${props.className}`}>
      <View className="pt-2 px-4">
        <Divider style={{ borderStyle: 'dashed', borderColor: '#DADADA' }} />
      </View>
      <View className="flex items-center justify-between absolute top-4 left-0 right-0">
        {state.list.map((x, i) => (
          <View key={i} className="flex-col-center gap-2">
            <View
              className={`w-5 h-5 box-border rounded-full text-[12px] text-white flex-center ${
                active >= x.step
                  ? 'bg-[#2E6EF4]'
                  : 'border-[1px] border-solid border-[#DADADA] bg-[#fff] text-[#DADADA]'
              }`}
            >
              {fulfill >= x.step ? <Checklist className="w-2 h-2" /> : x.step}
            </View>
            <View
              className={`font-bold text-[13px] ${
                active >= x.step ? 'text-[#2E6EF4]' : 'text-[#999999]'
              }`}
            >
              {x.label}
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default memo(Step)
