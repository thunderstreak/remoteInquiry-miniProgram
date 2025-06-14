import { View, Image, Text } from "@tarojs/components"
import { useDidShow } from "@tarojs/taro"
import Card from '../components/Card'
import Description from '../components/Description'
import './index.less'

export default function Index() {

  const handlerAgain = () => {
    console.log('再次进入')
  }

  const handlerToRecord = () => {
    console.log('进入执法记录')
  }

  useDidShow(() => {
    // 更新数据
    console.log('执法室列表 更新数据')
  })

  return (
    <View className="h-full w-full flex flex-col bg-[#1F3FBA]">
      <View className="flex-1 flex flex-col theme-bg">
        <View className="list-head text-white h-32 pl-16 pr-3 box-border flex flex-row flex items-center justify-center">
          <Image className="w-[72px] h-[80px] mr-6" src={require('@/assets/images/enforcement/base_head.png')}></Image>
          <View className="flex-row flex-1 text-[16px] leading-[22px]">
            <View className="">张三（JH0001）</View>
            <View className="text-[18] text-lg leading-[25px] font-medium">淳安交警大队一中队</View>
            <View className="flex flex-row items-center">
              <Text>身份审核通过</Text>
              <Image className="user-auth w-5 h-5 ml-2" src={require('@/assets/images/enforcement/icon-park.png')}></Image>
            </View>
          </View>
        </View>
        <View className="list-body flex flex-1 flex-col rounded-t-xl relative box-border px-[15px] py-[16px]">
          <View className="notice-line flex justify-between pl-4 pr-4 mb-4 rounded-lg h-[40px] bg-[#EEF5FE] text-[14px] text-[#6c6c6c]">
            <View className="flex flex-1 items-center">
              <Image className="mr-2 w-5 h-5" src={require('@/assets/images/enforcement/icon-notice.png')}></Image>
              <Text>xxxx案件</Text>
            </View>
            <View className="pl-2 flex items-center" onClick={handlerAgain}>
              <Image className="w-[66px] h-5" src={require('@/assets/images/enforcement/link_text.png')}></Image>
            </View>
          </View>
          <Card status={0} />
          <Card status={1} />
          <Card status={2} />
          <Card status={3} />
        </View>
        <Image className="w-[72px] h-[64px] fixed bottom-20 right-0" src={require('@/assets/images/enforcement/record_img.png')} onClick={handlerToRecord}></Image>
        <Description />
      </View>
    </View>
  )
}
