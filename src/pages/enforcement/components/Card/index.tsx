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
    <View className="card flex px-4 py-5 bg-white mb-2 rounded-lg relative">
      <Image className="card-logo mr-2" src={logoImg}></Image>
      <View className="card-content">
        <View className="card-content-title">淳安县执法室1</View>
        <View className="card-content-text">
          <Text>李四</Text>
          {
            true &&
            <Text className="" onClick={handlerToCall}>（<Text className="text-high">18569501321</Text>）</Text>
          }
        </View>
        <View className="card-content-desc">
          <Text>已办</Text>
          <Text className="ml-1">123</Text>
        </View>
      </View>
      <View className={`card-btn pl-3 pr-3 absolute right-4 bottom-4 rounded-full ${status === EnforcementStatusEnum.WAITING ? 'card-btn-wait' : ''}`} onClick={handlerToJump}>发起执法</View>
      <Image className="card-status absolute right-0 top-0" src={statusImg}></Image>
    </View>
  )
}
