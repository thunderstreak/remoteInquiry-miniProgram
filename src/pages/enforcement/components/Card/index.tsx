import { View, Image, Text } from "@tarojs/components";
import './index.less'
import { useCallback, useEffect, useMemo, useState } from "react";
import { EnforcementStatusEnum } from "../../list/type";
import Taro from "@tarojs/taro";
import { CardProps } from "./type";

export default function Index(props: CardProps) {
  const { roomInfo, disabled } = props
  const [useName, setUseName] = useState(roomInfo.useAdminName)
  const [phone, setPhone] = useState('')

  const logoImg = useMemo(() => {
    const imgMap = {
      [EnforcementStatusEnum.WAITING]: require('@/assets/images/enforcement/logo_wait.png'),
      [EnforcementStatusEnum.PROCESSING]: require('@/assets/images/enforcement/logo_underway.png'),
      [EnforcementStatusEnum.BREAK]: require('@/assets/images/enforcement/logo_break.png'),
      [EnforcementStatusEnum.OFF]: require('@/assets/images/enforcement/logo_off.png'),
    }
    return imgMap[roomInfo.isPut]
  }, [roomInfo])

  const statusImg = useMemo(() => {
    const imgMap = {
      [EnforcementStatusEnum.WAITING]: require('@/assets/images/enforcement/status_wait.png'),
      [EnforcementStatusEnum.PROCESSING]: require('@/assets/images/enforcement/status_underway.png'),
      [EnforcementStatusEnum.BREAK]: require('@/assets/images/enforcement/status_break.png'),
      [EnforcementStatusEnum.OFF]: require('@/assets/images/enforcement/status_off.png'),
    }
    return imgMap[roomInfo.isPut]
  }, [roomInfo])

  const handlerToJump = useCallback(() => {
    console.log('跳转')
    // 有正在处理中的案件，不能发起新的执法
    if (disabled || roomInfo.isPut !== EnforcementStatusEnum.WAITING) {
      return
    }
    Taro.navigateTo({
      url: `/pages/enforcement/apply/index?roomCode=${roomInfo.roomCode}&roomPassword=${roomInfo.roomPassword}`
    })
  }, [roomInfo, disabled])

  const handlerToCall = useCallback((phone: string) => {
    console.log('拨打电话')
    Taro.makePhoneCall({
      phoneNumber: phone
    })
  }, [])

  useEffect(() => {
    if (roomInfo.useAdminName) {
      const [name, phone] = roomInfo.useAdminName.split('(')
      if (name) {
        setUseName(name)
      }
      if (phone) {
        setPhone(phone.replace(')', ''))
      }
    }
  }, [roomInfo])

  return (
    <View className="card min-h-[70px] text-base flex px-4 py-5 bg-white mb-2 rounded-lg relative leading-[19px]">
      <Image className="card-logo mr-2 w-10 h-10" src={logoImg}></Image>
      <View className="card-content flex-1">
        <View className="text-[20px] leading-[22px] text-[#333] font-medium">{roomInfo.roomName}</View>
        <View className="mt-[6px] font-medium">
          {
            roomInfo.isPut === EnforcementStatusEnum.PROCESSING
             ? (<Text>{roomInfo.nowPeople}</Text>)
             : (<Text>{useName || ''}</Text>)
          }
          {
            phone &&
            <Text onClick={() => handlerToCall(phone)}>（<Text className="text-[#0F40F5]">{phone}</Text>）</Text>
          }
        </View>
        <View className="text-[#6c6c6c] mt-3">
          <Text>已办</Text>
          <Text className="ml-[8px]">{roomInfo.finishNum || 0}</Text>
        </View>
      </View>
      <View className={`text-white h-[34px] leading-[34px] pl-4 pr-4 text-base absolute right-4 bottom-4 rounded-full ${roomInfo.isPut === EnforcementStatusEnum.WAITING && !disabled ? 'bg-[#4D79F2]' : 'bg-[#BBBBBB]'}`} onClick={handlerToJump}>发起执法</View>
      <Image className="w-[50px] h-[50px] absolute right-0 top-0" src={statusImg}></Image>
    </View>
  )
}
