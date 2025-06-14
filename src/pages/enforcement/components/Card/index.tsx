import { View, Image, Text } from "@tarojs/components";
import './index.less'
import { useCallback, useMemo } from "react";
import { EnforcementStatusEnum } from "./type";
import Taro from "@tarojs/taro";

export default function Index({ status = EnforcementStatusEnum.WAITING}) {

  const logoImg = useMemo(() => {
    const imgMap = {
      [EnforcementStatusEnum.WAITING]: require('@/assets/images/enforcement/logo_wait.png'),
      [EnforcementStatusEnum.PROCESSING]: require('@/assets/images/enforcement/logo_underway.png'),
      [EnforcementStatusEnum.BREAK]: require('@/assets/images/enforcement/logo_break.png'),
      [EnforcementStatusEnum.OFF]: require('@/assets/images/enforcement/logo_off.png'),
    }
    return imgMap[status]
  }, [status])

  const statusImg = useMemo(() => {
    const imgMap = {
      [EnforcementStatusEnum.WAITING]: require('@/assets/images/enforcement/status_wait.png'),
      [EnforcementStatusEnum.PROCESSING]: require('@/assets/images/enforcement/status_underway.png'),
      [EnforcementStatusEnum.BREAK]: require('@/assets/images/enforcement/status_break.png'),
      [EnforcementStatusEnum.OFF]: require('@/assets/images/enforcement/status_off.png'),
    }
    return imgMap[status]
  }, [status])

  const handlerToJump = useCallback(() => {
    console.log('跳转')
  }, [status])

  const handlerToCall = useCallback(() => {
    console.log('拨打电话')
    Taro.makePhoneCall({
      phoneNumber: '18569501321'
    })
  }, [])

  return (
    <View className="card text-base flex px-4 py-5 bg-white mb-2 rounded-lg relative leading-[19px]">
      <Image className="card-logo mr-2 w-10 h-10" src={logoImg}></Image>
      <View className="card-content">
        <View className="text-[20px] leading-[22px] text-[#333] font-medium">淳安县执法室1</View>
        <View className="mt-[6px] font-medium">
          <Text>李四</Text>
          {
            true &&
            <Text onClick={handlerToCall}>（<Text className="text-[#0F40F5]">18569501321</Text>）</Text>
          }
        </View>
        <View className="text-[#6c6c6c] mt-2">
          <Text>已办</Text>
          <Text className="ml-[8px]">123</Text>
        </View>
      </View>
      <View className={`text-white h-[34px] leading-[34px] pl-4 pr-4 text-base absolute right-4 bottom-4 bg-[#BBBBBB] rounded-full ${status === EnforcementStatusEnum.WAITING ? 'bg-[#4D79F2]' : ''}`} onClick={handlerToJump}>发起执法</View>
      <Image className="w-[50px] h-[50px] absolute right-0 top-0" src={statusImg}></Image>
    </View>
  )
}
