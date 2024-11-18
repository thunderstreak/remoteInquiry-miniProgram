import { View } from '@tarojs/components'
import './index.less'

export default function Index() {
  return (
    <View className="flex flex-col h-screen">
      <View className="flex-1 overflow-auto content text-[12px] text-[#000] p-[12px] text-justify">
        <View className="mb-2 text-[16px] font-bold text-center">隐私政策</View>
        <View className="text-[16px] font-bold">1.用户信息公开情况说明</View>
        <View className="">
          尊重用户个人隐私是证易通的一项基本政策。所以，证易通不会在未经合法用户授权时公开、编辑或透露其资料及保存在本应用中的非公开内容，除非有下列情况:
        </View>
        <View className="">(1)有关法律规定或证易通合法服务程序规定:</View>
        <View className="">(2)在紧急情况下，为维护用户及公众的权益;</View>
        <View className="">
          (3)为维护证易通的商标权、专利权及其他任何合法权益;
        </View>
        <View className="">
          证易通有权在必要时修改服务条款，服务条款一旦发生变更，将会在重要页面上提示修改内容，如果不同意所改动的内容，用户可以放弃获得的本应用信息服务。如果用户继续享用本应用的信息服务，则视为接受服务条款的变更。本应用保留随时修改或中断服务而不需要通知用户的权利。本应用行使修改或中断服务的权利，不需对用户或第三方负责。
        </View>
      </View>
    </View>
  )
}
