import { useCallback, useEffect, useState } from 'react'
import Taro, { useDidShow, usePullDownRefresh } from '@tarojs/taro'
import { Button, Divider } from '@nutui/nutui-react-taro'
import { Image, Text, View } from '@tarojs/components'
import NavHeader from '@/components/NavHeader'
import * as Res from '@/@type/response'
import XYRTC from '@xylink/xy-mp-sdk'
import { useSelector } from 'react-redux'
import { selectUserInfo } from '@/store/slice/user'
import { useSetting } from '@/hooks/useSetting'
import config from '@/config'
import HomeApi from '@/api/home'
import CommonApi from '@/api/common'
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

  const handleGetSignTemplate = useCallback(() => {
    CommonApi.getSaasInfo().then((res) => {
      const { data } = res
      if (data) {
        Taro.setStorageSync('REMARK_TEMPLATE', data.xwtzs_remark)
      }
    })
  }, [])

  const handleUploadFinger = useCallback((data: Res.RoomQueryRoomList) => {
    const { fingerUrl, isShowFinger } = data
    if (isShowFinger && !fingerUrl) {
      Taro.navigateTo({ url: '/pages/' })
    }
  }, [])

  const handleGetAllInfo = useCallback(() => {
    handleGetRoomList().catch(console.log)
    handleGetSignTemplate()
  }, [handleGetRoomList, handleGetSignTemplate])

  usePullDownRefresh(async () => {
    await handleGetRoomList()
    Taro.stopPullDownRefresh()
  })

  useDidShow(() => {
    handleGetAllInfo()
  })

  useEffect(() => {
    handleGetAllInfo()
  }, [handleGetAllInfo])

  return (
    <View className="h-full w-full flex flex-col bg-[#2766CF]">
      <View className="flex-shrink-0 flex flex-col justify-between">
        <View className="flex-shrink-0">
          <NavHeader title="千名千探" />
        </View>
        <View className="flex-col-center pt-[20px]">
          <View className="flex-center gap-3 py-[25px] mb-[10px] w-[260px]">
            <Image
              className="w-[72px] h-[80px]"
              src={require('../../assets/img/icon_card.png')}
            />
            <View className="flex flex-col text-white text-[16px] font-normal gap-[6px]">
              <View className="text-[14px] text-[#CECECE]">
                {userInfo.userName}
              </View>
              <View className="text-[14px] text-[#CECECE]">
                {userInfo.cardNo}
              </View>
              <View className="flex items-center gap-2">
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

          {/* <View className="w-[260px]">
            <Divider style={{ borderStyle: 'dashed', borderColor: 'white' }} />
          </View>*/}
        </View>
      </View>
      <View className="flex-1 flex flex-col rounded-t-[20px] bg-color pt-[25px] px-3">
        <View className="flex-1 flex flex-col gap-2">
          {list.map((x, i) => (
            <View className="rounded-[8px] bg-white py-3" key={i}>
              <View className="px-4 flex flex-col gap-2 text-[13px] font-medium">
                <View className="flex items-center justify-end ">
                  <View className="text-[#0F40F5] text-[12px] font-medium py-[2px] px-2 rounded bg-[#FCCA00] border-[1px] border-solid border-[#0F40F5]">
                    取证中
                  </View>
                </View>
                <View className="flex-center gap-3">
                  <Image
                    className="w-[66px] h-[66px]"
                    src={require('../../assets/img/icon_case.png')}
                  />
                  <View className="flex-1 flex flex-col gap-[6px]">
                    <View className="text-[14px]">
                      <Text className="text-[#6C6C6C]">案件编号：</Text>
                      {x.lawCode}
                    </View>
                    <View className="text-[14px]">
                      <Text className="text-[#6C6C6C]">案件名称：</Text>
                      {x.lawName}
                    </View>
                    <View className="text-[14px]">
                      <Text className="text-[#6C6C6C]">预约时间：</Text>
                      {x.createTime}
                    </View>
                  </View>
                </View>
              </View>
              <Divider style={{ borderColor: '#E9E9E9', margin: '10px 0' }} />
              {x.isShowFinger ? (
                <View className="flex flex-col px-3">
                  <View className="pb-[10px] text-[12px] text-[#6C6C6C]">
                    根据取证要求，进入取证室需要完成：
                  </View>
                  <View className="border border-solid border-[#BBBBBB] rounded-[5px] px-5 py-[18px] flex-center">
                    <View className="flex items-center gap-4 flex-1">
                      <Image
                        className="w-[34px] h-[34px]"
                        src={require('../../assets/img/icon_finger.png')}
                      />
                      <View className="flex flex-col gap-1">
                        <View className="text-[14px] text-[#333333]">
                          指纹上传
                        </View>
                        <View className="text-[12px] text-[#6C6C6C]">
                          请上传本人指纹
                        </View>
                      </View>
                    </View>
                    <View
                      className="text-[14px]"
                      onClick={() => handleUploadFinger(x)}
                    >
                      {x.fingerUrl ? (
                        <Text className="text-[#6C6C6C] font-bold">已上传</Text>
                      ) : (
                        <Text className="text-[#0F40F5] font-bold">
                          去采集&gt;
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
              ) : null}

              <View className="px-3 py-8">
                <Button
                  block
                  type="primary"
                  disabled={!x.fingerUrl}
                  color={x.fingerUrl ? '#3777E1' : '#9BBBF0'}
                  className="!h-[52px] !rounded-[10px] border-0"
                  onClick={() => handleEntry(x)}
                >
                  进入取证室
                </Button>
              </View>
            </View>
          ))}
        </View>
        <View className="flex-shrink-0 text-[12px] text-[#999999] font-medium flex-center pb-[40px]">
          {userInfo.orgName}
        </View>
      </View>
    </View>
  )
}
