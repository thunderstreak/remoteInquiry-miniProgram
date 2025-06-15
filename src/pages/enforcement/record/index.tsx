import { View, Text, Image } from "@tarojs/components";
import './index.less';
import { Step, Steps } from "@nutui/nutui-react-taro";
import Description from "../components/Description";

export default function Index() {
  const data = [
    {
      value: 1,
      description: '2023-08-01 10:00:00',
    },
    {
      value: 2,
      description: '2023-08-02 14:30:00',
    },
    {
      value: 3,
      description: '2023-08-03 18:45:00',
    },
  ];
  return (
    <View className="linear-bg h-full w-full flex flex-col">
      <View className="flex-1 flex flex-col px-4 py-4 box-border overflow-y-auto">
        <Steps direction="vertical" value={0} dot={true}>
          {data.map((item, index) => (
            <Step
              key={index}
              value={item.value}
              title={
                <View className="text-sm text-[#999]">发起时间：2025-06-12 12:12:01</View>
              }
              description={
                <View className="flex flex-col relative text-xs text-[#666] pb-4">
                  <View className="h-6 leading-6 text-xs rounded-se-md rounded-es-md absolute right-0 top-0 bg-[#AFE2C7] text-[#009846] px-[10px]">已完成</View>
                  <View className="px-4 pt-4 pb-2 bg-white rounded-t-md">
                    <View className="text-lg font-medium text-[#333] leading-[24px] mb-2">张三打人案</View>
                    <View className="leading-[18px]">
                      <Text className="font-medium text-[#333]">执法室：</Text>
                      <Text >执法室房间名称</Text>
                    </View>
                    <View className="leading-[16px]">
                      <Text className="font-medium text-[#333]">违法时间：</Text>
                      <Text >2025-06-12 12:12:01</Text>
                    </View>
                    <View className="leading-[16px]">
                      <Text className="font-medium text-[#333]">违法地点：</Text>
                      <Text >违法地点</Text>
                    </View>
                    <View className="leading-[16px]">
                      <Text className="font-medium text-[#333]">违法类型：</Text>
                      <Text >违法类型</Text>
                    </View>
                    <View className="leading-[16px]">
                      <Text className="font-medium text-[#333]">违法行为：</Text>
                      <Text >违法行为</Text>
                    </View>
                    <View className="leading-[16px]">
                      <Text className="font-medium text-[#333]">协 辅 警：</Text>
                      <Text >协 辅 警</Text>
                    </View>
                  </View>
                  <View className="px-4 py-2 status-column rounded-b-md">
                    <View className="leading-[16px]">
                      <Text className="font-medium text-[#333]">当 事 人：</Text>
                      <Text >姓名/手机号/身份证号码</Text>
                    </View>
                    <View className="leading-[16px]">
                      <Text className="font-medium text-[#333]">备 注：</Text>
                      <Text >备注内容</Text>
                    </View>
                  </View>

                </View>
              }
            />
          ))}
        </Steps>
      </View>
      <Description />
    </View>
  )
}
