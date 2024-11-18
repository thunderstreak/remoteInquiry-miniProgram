import { View } from '@tarojs/components'
import './index.less'

export default function Index() {
  return (
    <View className="flex flex-col h-screen">
      <View className="flex-1 overflow-auto text-[12px] text-[#000] p-[12px] text-justify">
        <View className="mb-2 text-[16px] font-bold text-center">
          用户服务协议
        </View>
        <View className="mb-2 indent-6">
          尊敬的用户，欢迎使用由证易通(南京)智能科技有限公司(下列简称为“证易通”)提供的服务。在使用前请您阅读如下服务协议，使用本应用即表示您同意接受本协议，本协议产生法律效力，特别涉及免除或者限制维聚责任的条款，请仔细阅读。如有任何问题，可向证易通询。
        </View>
        <View className="text-[16px] font-bold">1.服务条款的确认和接受</View>
        <View className="pl-6">
          通过访问或使用本应用，表示用户同意接受本协议的所有条件和条款。
        </View>
        <View className="text-[16px] font-bold">2.服务条款的变更和修改</View>
        <View className="pl-6">
          证易通有权在必要时修改服务条款，服务条款一旦发生变更，将会在重要页面上提示修改内容。如果不同意所改动的内容，用户可以放弃获得的本应用信息服务。如果用户继续享用本应用的信息服务，则视为接受服务条款的变更。本应用保留随时修改或中断服务而不需要通知用户的权利。本应用行使修改或中断服务的权利，不需对用户或第三方负责。
        </View>
      </View>
    </View>
  )
}
