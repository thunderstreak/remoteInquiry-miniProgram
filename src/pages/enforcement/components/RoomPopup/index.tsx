import { GetRoomListRes } from "@/@type/response"
import { Popup } from "@nutui/nutui-react-taro"
import { View, Image, Text, Button } from "@tarojs/components"
import { useCallback, useEffect, useState } from "react"
import enforcementApi from "@/api/enforcement"
import { EnforcementStatusEnum } from "../../list/type"
import './index.less'
export default function RoomPopup({ visible, setVisible, onConfirm }) {
  const DOWN_NUMBER = 60
  const [loading, setLoading] = useState<boolean>(false)
  const [roomList, setRoomList] = useState<GetRoomListRes[]>([])
  const [downCount, setDownCount] = useState<number>(DOWN_NUMBER)
  let downTimer: NodeJS.Timeout | undefined

  const handleConfirm = useCallback((item: GetRoomListRes) => {
    setVisible(false)
    onConfirm(item)
  }, [setVisible])

  const queryPoliceRoomList = useCallback(async () => {
    try {
      setLoading(true)
      const res = await enforcementApi.queryPoliceRoomList()
      console.log('查询执法室列表', res)
      // 仅显示空闲的执法室
      setRoomList((res.data || []).filter(item => item.isPut === EnforcementStatusEnum.WAITING))
    } catch (error) {}
    finally {
      setLoading(false)
    }
  }, [loading])

  const clearDownCountTimer = () => {
    console.log('clearDownCountTimer', downTimer)
    if (downTimer !== undefined) {
      clearInterval(downTimer)
      downTimer = undefined
      setDownCount(DOWN_NUMBER)
    }
  }

  useEffect(() => {
    if (!loading) {
      console.log('仅加载结束触发', loading)
      clearDownCountTimer()
      let num = DOWN_NUMBER
      downTimer = setInterval(() => {
        if (num === 0) {
          clearDownCountTimer()
          // 自动刷新
          queryPoliceRoomList()
          return
        }
        num--
        setDownCount((prevCount) => prevCount - 1)
      }, 1000)
    }
    return () => {
      clearDownCountTimer()
    }
  }, [loading])

  useEffect(() => {
    if (visible) {
      queryPoliceRoomList()
    }
  }, [visible])

  return (
    <Popup
        visible={visible}
        position="bottom"
        closeOnOverlayClick={false}
        onClose={() => {
          setVisible(false)
        }}
      >
        <View className="flex flex-col min-h-[70vh] bg-[#F8F8F8]">
          <View className="px-8 relative">
            {
              roomList.length > 0 && (
                <View className="popup-head min-h-[30px] py-4 flex flex-col items-center leading-[28px]">
                  <View className="text-xl text-[#333]">您选择的执法室已被占用</View>
                  <View className="text-xl text-[#333] flex items-center">
                    <Text>请</Text>
                    <Text className="text-[#FF2E2E]">重新选择</Text>
                    <Text className="text-base text-[#999]">（{downCount}s）</Text>
                    <View onClick={queryPoliceRoomList}>
                      <Text className="text-base text-[#0F40F5]">刷新</Text>
                      <Image className="w-[14px] h-[14px] ml-1" src={require('@/assets/images/enforcement/icon_refresh.png')} />
                    </View>
                  </View>
                </View>
              )
            }
            <Image
              className="w-6 h-6 absolute right-[10px] top-4"
              src={require('@/assets/images/enforcement/icon_close.png')}
              onClick={() => setVisible(false)}
              />
          </View>
          <View className="flex-1 overflow-y-auto px-[15px]">
            {
              roomList.map(item => (
                <View className="flex items-center justify-between px-4 py-4 mt-4 bg-white rounded-[10px]" key={item.roomCode}>
                  <View className="flex items-center flex-1">
                    <Image className="mr-2 w-10 h-10" src={require('@/assets/images/enforcement/logo_wait.png')}></Image>
                    <View className="flex flex-1 flex-col text-xl">
                      <Text className="text-[#333] text-xl">{item.roomName || ''}</Text>
                      <Text className="text-[#333] text-base ml-2">{item.nowPeople || ''}</Text>
                    </View>
                  </View>
                  <Button
                    className="h-[34px] leading-[34px] px-3 text-base text-white text-center bg-[#4D79F2] rounded-[17px]"
                    onClick={() => handleConfirm(item)}
                    >进入执法室</Button>
                </View>
              ))
            }
            {
              roomList.length === 0 && loading === false && (
                <View className="flex flex-col items-center justify-center mt-20">
                  <Image className="w-[278px] h-[180px] text-xl text-[#333]" src={require('@/assets/images/enforcement/empty_01.png')} />
                  <View className="text-[#333] text-xl mt-4">暂无空闲中的执法室</View>
                  <View className="text-[#999] text-base mt-2">
                    <Text className="text-[#0F40F5]">{downCount}s</Text>
                    <Text>后自动刷新</Text>
                  </View>
                  <Button
                    className="w-[128px] h-10 leading-[40px] text-base text-white text-center mt-6 bg-[#4D79F2] rounded-[17px]"
                    onClick={queryPoliceRoomList}
                    >手动刷新</Button>
                </View>
              )
            }
          </View>
        </View>

    </Popup>
  )
}
