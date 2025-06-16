import { useMemo, useState } from "react"
import { View, Image, Text } from "@tarojs/components"
import { useDidShow, usePullDownRefresh } from "@tarojs/taro"
import Card from '../components/Card'
import Description from '../components/Description'
import { useSelector } from "react-redux"
import { selectUserInfo } from "@/store/slice/user"
import enforcementApi from '@/api/enforcement'
import { GetEnforcementStatusRes, GetRoomListRes } from "@/@type/response"
import './index.less'
import Taro from "@tarojs/taro"

export default function Index() {
  const userInfo = useSelector(selectUserInfo)
  const [roomList, setRoomList] = useState<GetRoomListRes[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [processingInfo, setProcessingInfo] = useState<GetEnforcementStatusRes | null>(null)

  const listDisabled = useMemo(() => {
    return processingInfo !== null
  }, [processingInfo])

  const handlerAgain = () => {
    console.log('再次进入')
  }

  const handlerToRecord = () => {
    console.log('进入执法记录')
    Taro.navigateTo({
      url: '/pages/enforcement/record/index'
    })
  }

  const queryPoliceRoomList = async () => {
    const res = await enforcementApi.queryPoliceRoomList()
    console.log('查询执法室列表', res)
    setRoomList(res.data || [])
    return res
  }

  const queryLawPoliceNotColse = async () => {
    const res = await enforcementApi.queryLawPoliceNotColse()
    console.log('是否有正在执行的案件： ', res)
    const list = res.data || []
    setProcessingInfo(list?.[0] || null)
    return res
  }

  const loadAllRely = async () => {
    try {
      setLoading(true)
      await Promise.all([queryLawPoliceNotColse(), queryPoliceRoomList()]).then(res => {
        console.log('查询数据完成', res)
      })
      console.log('load all rely')
    } catch (error) {}
    finally {
      setLoading(false)
    }
  }


  useDidShow(() => {
    // 更新数据
    console.log('执法室列表 更新数据')
    loadAllRely()
  })

  // 下拉刷新
  usePullDownRefresh(async () => {
    // Taro.startPullDownRefresh()
    await loadAllRely()
    Taro.stopPullDownRefresh()
  })

  return (
    <View className="h-full w-full flex flex-col bg-[#1F3FBA]">
      <View className="flex-1 flex flex-col theme-bg">
        <View className="list-head text-white h-32 pl-16 pr-3 box-border flex flex-row flex items-center justify-center">
          <Image className="w-[72px] h-[80px] mr-6" src={require('@/assets/images/enforcement/base_head.png')}></Image>
          <View className="flex-row flex-1 text-[16px] leading-[22px]">
            <View className="">{userInfo.userName}（{userInfo.loginCode}）</View>
            <View className="text-[18] text-lg leading-[25px] font-medium">{userInfo.departmentName}</View>
            <View className="flex flex-row items-center">
              <Text>身份审核通过</Text>
              <Image className="user-auth w-5 h-5 ml-2" src={require('@/assets/images/enforcement/icon-park.png')}></Image>
            </View>
          </View>
        </View>
        <View className="list-body flex flex-1 flex-col rounded-t-xl relative box-border px-[15px] py-[16px]">
          {
            processingInfo !== null && (
              <View className="notice-line flex justify-between pl-4 pr-4 mb-4 rounded-lg h-[40px] bg-[#EEF5FE] text-[14px] text-[#6c6c6c]">
                <View className="flex flex-1 items-center">
                  <Image className="mr-2 w-5 h-5" src={require('@/assets/images/enforcement/icon-notice.png')}></Image>
                  <Text>{processingInfo.title || ''}</Text>
                </View>
                <View className="pl-2 flex items-center" onClick={handlerAgain}>
                  <Image className="w-[66px] h-5" src={require('@/assets/images/enforcement/link_text.png')}></Image>
                </View>
              </View>
            )
          }
          {
            roomList.map(item => (<Card info={item} disabled={listDisabled} />))
          }
          {
            roomList.length && (
              <View className="h-[50px] flex items-center justify-center">
                <Text className="text-[16px] text-[#999]">没有更多了</Text>
              </View>
            )
          }
          {
            roomList.length === 0 && (
              <View className="flex flex-1 flex-col items-center justify-center">
                <Image className="w-[120px] h-[120px]" src={require('@/assets/images/enforcement/empty_01.png')}></Image>
                <Text className="text-[16px] text-[#999]">暂无数据</Text>
              </View>
            )
          }
        </View>
        <Image className="w-[72px] h-[64px] fixed bottom-20 right-0" src={require('@/assets/images/enforcement/record_img.png')} onClick={handlerToRecord}></Image>
        <Description />
      </View>
    </View>
  )
}
