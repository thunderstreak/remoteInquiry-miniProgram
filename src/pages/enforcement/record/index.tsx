import { View, Text } from "@tarojs/components";
import { Step, Steps } from "@nutui/nutui-react-taro";
import Description from "../components/Description";
import Empty from "@/components/Empty";
import { useEffect, useState } from "react";
import { GetEnforcementStatusRes } from "@/@type/response";
import enforcementApi from "@/api/enforcement";
import { usePullDownRefresh } from "@tarojs/taro";
import Taro from "@tarojs/taro";
import './index.less';

export default function Index() {
  const [list, setList] = useState<GetEnforcementStatusRes[]>([]);

  const getRecordList = async () => {
    const res = await enforcementApi.queryLawPoliceList();
    if (res.code === 200) {
      setList(res.data || []);
    }
  }

  // 下拉刷新
  usePullDownRefresh(async () => {
    await getRecordList()
    Taro.stopPullDownRefresh()
  })

  useEffect(() => {
    getRecordList();
  },[])

  return (
    <View className="linear-bg h-full w-full flex flex-col">
      {
        list.length > 0 && (
          <View className="flex-1 overflow-y-auto">
            <View className="flex flex-col px-4 py-4 box-border">
              <Steps direction="vertical" value={0} dot={true}>
                {list.map((item, index) => (
                  <Step
                    key={index}
                    value={index}
                    title={
                      <View className="text-sm text-[#999]">发起时间：{item.createTime || ''}</View>
                    }
                    description={
                      <View className="flex flex-col relative text-xs text-[#666] pb-4">
                        <View className={'h-6 leading-6 text-xs rounded-se-md rounded-es-md absolute right-0 top-0 px-[10px] ' + ([0,1,2].includes(item.isPut) ? 'bg-[#ECB9B9] text-[#CB0000]' : `bg-[#AFE2C7] text-[#009846]`)}>
                          {[0,1,2].includes(item.isPut) ? '未完成' : '已完成'}
                        </View>
                        <View className="px-4 pt-4 pb-2 bg-white rounded-t-md">
                          <View className="text-lg font-medium text-[#333] leading-[24px] mb-2">{item.title || ''}</View>
                          <View className="leading-[18px]">
                            <Text className="font-medium text-[#333]">执法室：</Text>
                            <Text >{item.roomName || ''}</Text>
                          </View>
                          <View className="leading-[18px] mt-1">
                            <Text className="font-medium text-[#333]">违法时间：</Text>
                            <Text >{item.lawDate || ''}</Text>
                          </View>
                          <View className="leading-[18px] mt-1">
                            <Text className="font-medium text-[#333]">违法地点：</Text>
                            <Text >{item.lawAddress || ''}</Text>
                          </View>
                          <View className="leading-[18px] mt-1">
                            <Text className="font-medium text-[#333]">违法类型：</Text>
                            <Text >{item.lawTypeName || ''}</Text>
                          </View>
                          <View className="leading-[18px] mt-1">
                            <Text className="font-medium text-[#333]">违法行为：</Text>
                            <Text >{item.lawBehaviorName || ''}</Text>
                          </View>
                          {
                            item.joinPeople !== '' && (
                              <View className="leading-[18px] mt-1">
                                <Text className="font-medium text-[#333]">协 辅 警：</Text>
                                <Text >{item.joinPeople || ''}</Text>
                              </View>
                            )
                          }
                        </View>
                        <View className={'px-4 py-2 rounded-b-md ' + ([0,1,2].includes(item.isPut) ? 'status-column-error' : 'status-column')}>
                          <View className="leading-[18px] mt-1">
                            <Text className="font-medium text-[#333]">当 事 人：</Text>
                            <Text className="text-[11px]">{
                              [item.partiesName, item.partiesCard, item.partiesPhone].filter(x => !!x).join('/')
                            }</Text>
                          </View>
                          {
                            item.remark !== '' && (
                              <View className="leading-[18px] mt-1">
                                <Text className="font-medium text-[#333]">备 注：</Text>
                                <Text >{item.remark || ''}</Text>
                              </View>
                            )
                          }
                        </View>

                      </View>
                    }
                  />
                ))}
              </Steps>
            </View>
          </View>
        )
      }
      {
        list.length === 0 && (
          <Empty url={require('@/assets/images/enforcement/empty_01.png')} imgClassName="w-[278px] h-[180px]" className="flex-1" />
        )
      }
      <Description />
    </View>
  )
}
