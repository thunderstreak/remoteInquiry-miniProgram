import { useCallback, useEffect, useState } from 'react'
import Taro, { usePullDownRefresh } from '@tarojs/taro'
import { Divider } from '@nutui/nutui-react-taro'
import { Image, Text, View } from '@tarojs/components'
import NavHeader from '@/components/NavHeader'
import * as Res from '@/@type/response'
import XYRTC from '@xylink/xy-mp-sdk'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '@/store/slice/user'
import { useSetting } from '@/hooks/useSetting'
import config from '@/config'
import HomeApi from '@/api/home'
import './index.less'

export default function Index() {
  // const router = useRouter()
  const userInfo = useSelector(selectUserInfo)
  const [list, setList] = useState<Res.RoomQueryRoomList[]>([])
  const { handleSetting } = useSetting()
  // console.log(router)
  // console.log(userInfo) 9042180858

  // 跳转会议
  // const handleNavigateTo = useCallback(() => {
  //   const number = userInfo.roomCode
  //   const password = userInfo.roomPassword
  //   const name = userInfo.userName
  //   console.log(number, password, name)
  //   Taro.navigateTo({
  //     url: `/pages/conference/index?displayName=${name}&password=${password}&number=${number}&videoMute=${false}&audioMute=${false}`
  //   })
  // }, [userInfo.roomCode, userInfo.roomPassword, userInfo.userName])

  // 登陆会议
  const handleCallNumber = useCallback(
    async (user: Res.RoomQueryRoomList) => {
      const res = await handleSetting()
      if (!res) {
        return
      }
      const { roomCode, roomPassword, userName, id, lawId } = user
      const XYClient = XYRTC.createClient({
        report: true,
        extId: config.DEFAULT_EXTID,
        appId: config.DEFAULT_APPID
      })
      // 登陆
      const response = await XYClient.loginExternalAccount({
        extUserId: id,
        displayName: userName
      })
      const { code, data = {} } = response || {}
      // 状态是200时，初始化登录成功
      if (code === 200 || code === 'XYSDK:980200') {
        const cn = data.callNumber
        console.log(cn)
        XYClient.showToast('登录成功')
        await Taro.navigateTo({
          url: `/pages/conference/index?displayName=${userName}&password=${roomPassword}&number=${roomCode}&videoMute=${false}&audioMute=${false}&lawId=${lawId}`
        })
      } else {
        XYClient.showToast('登录失败，请稍后重试')
      }
    },
    [handleSetting]
  )

  const handleEntry = useCallback(
    (data: Res.RoomQueryRoomList) => {
      Taro.showLoading()
      handleCallNumber(data).finally(() => {
        Taro.hideLoading()
      })
    },
    [handleCallNumber]
  )

  const handleGetRoomList = useCallback(async () => {
    await HomeApi.roomQueryRoomList({
      userName: userInfo.userName,
      cardNo: userInfo.cardNo
    }).then((res) => {
      const { data } = res
      if (data) {
        setList(data)
      }
      return res
    })
  }, [userInfo.cardNo, userInfo.userName])

  usePullDownRefresh(async () => {
    await handleGetRoomList()
    Taro.stopPullDownRefresh()
  })

  useEffect(() => {
    handleGetRoomList()
  }, [handleGetRoomList])

  return (
    <View className="h-full w-full flex flex-col bg-[#2766CF]">
      <View className="flex-shrink-0 flex flex-col justify-between">
        <View className="flex-shrink-0">
          <NavHeader title="千名千探" />
        </View>
        <View className="flex-col-center">
          <View className="flex-center gap-3 pt-[37px]">
            <Image
              className="w-[60px] h-[60px]"
              src={require('../../assets/img/icon_card.png')}
            />
            <View className="flex flex-col text-white text-[16px] font-normal gap-[6px]">
              <View>{userInfo.userName}</View>
              <View>{userInfo.cardNo}</View>
            </View>
          </View>

          <View className="w-[260px]">
            <Divider style={{ borderStyle: 'dashed', borderColor: 'white' }} />
          </View>
          <View className="flex-center gap-2 pb-[33px]">
            <Text className="text-[18px] font-medium text-white">
              身份审核通过
            </Text>
            <Image
              className="w-5 h-5"
              src={require('../../assets/img/icon_safety.png')}
            />
          </View>
        </View>
      </View>
      <View className="flex-1 flex flex-col rounded-t-[20px] bg-color pt-[25px] px-3">
        <View className="flex-1">
          {list.map((x, i) => (
            <View className="rounded-[8px] bg-white py-3" key={i}>
              <View className="px-4 flex flex-col gap-2 text-[13px] font-medium">
                <View className="flex items-center justify-between ">
                  <Image
                    className="w-5 h-5"
                    src={require('../../assets/img/icon_copy.png')}
                  />
                  <View className="text-white text-[12px] font-medium py-1 px-2 rounded bg-[#FA913A]">
                    待进入
                  </View>
                </View>
                <View>案件编号：{x.lawCode}</View>
                <View>案件名称：{x.lawName}</View>
                <View>预约时间：{x.createName}</View>
              </View>
              <Divider style={{ borderColor: '#E9E9E9', margin: '10px 0' }} />
              <View
                className="text-[16px] font-medium  text-center text-[#3777E1]"
                onClick={() => handleEntry(x)}
              >
                进入取证室
              </View>
            </View>
          ))}
        </View>
        <View className="flex-shrink-0 text-[12px] text-[#999999] font-medium flex-center pb-[40px]">
          某某分局执法中心
        </View>
      </View>
    </View>
  )
}
