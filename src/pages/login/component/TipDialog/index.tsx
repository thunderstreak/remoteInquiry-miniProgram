import { Dialog } from "@nutui/nutui-react-taro";
import { View, Image, Text, ScrollView } from "@tarojs/components";
import Taro from "@tarojs/taro";
import { useEffect, useState } from "react";
import { TipDialogProps } from "./type";
import './index.less'

export default function TipDialog(props: TipDialogProps) {
  const { visible, handleNavigateTo } = props;
  const [timeLeft, setTimeLeft] = useState(8);

  useEffect(() => {
    if (timeLeft > 0 && visible) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1)
      }, 1000)
      return () => clearInterval(intervalId)
    } else if (visible === false) {
      setTimeLeft(8)
    }
  }, [visible, timeLeft])

  useEffect(() => {
    if (timeLeft === 0) {
      handleNavigateTo()
     }
  }, [timeLeft])

  return (
    <Dialog
        title={
          <View className="flex justify-between items-center gap-2 text-[24px] font-medium">
            <Text>警方提示</Text>
            <Image
              className="w-[85px] h-[66px]"
              src={require('@/assets/img/tip_img.png')}
            />
          </View>
        }
        className="custom-dialog"
        visible={visible}
        hideCancelButton
        onConfirm={handleNavigateTo}
        confirmText={<View>继续({timeLeft ?? ''}s)</View>}
      >
        <ScrollView scrollY className="mt-6 max-h-[420px]">
          <View className="flex flex-col gap-3 text-[14px] font-medium">
            <View className="flex">
              <View className="w-2 h-2 rounded-full bg-[#3777E1] ml-1 mt-2 mr-2 flex-shrink-0" />
              <Text>
                任何情况下执法人员都不会要求被询问人转账到指定账户下，不会要求提供任何账号或密码。
              </Text>
            </View>
            <View className="flex">
              <View className="w-2 h-2 rounded-full bg-[#3777E1] ml-1 mt-2 mr-2 flex-shrink-0" />
              <Text>
                询问时请选择整洁、安静的环境，并保持手机电量充足，网络畅通，条件容许请优先选择稳定的WIFI上网。
              </Text>
            </View>
            <View className="flex">
              <View className="w-2 h-2 rounded-full bg-[#3777E1] ml-1 mt-2 mr-2 flex-shrink-0" />
              <Text>
                为保证询问过程不掉线，请勿中途退出，并拒绝任何来电，确保没有其他人员在场或被干扰。
              </Text>
            </View>
            <View className="flex">
              <View className="w-2 h-2 rounded-full bg-[#3777E1] ml-1 mt-2 mr-2 flex-shrink-0" />
              <Text>
                进入视频后，请将手机固定并保持一定距离，确保人员在一直在视频画面中。
              </Text>
            </View>
            <View className="flex">
              <View className="w-2 h-2 rounded-full bg-[#3777E1] ml-1 mt-2 mr-2 flex-shrink-0" />
              <Text>
                询问过程中若不慎退出，请重新通过公众号进入小程序，切勿直接通过小程序进入。
              </Text>
            </View>
          </View>
        </ScrollView>
      </Dialog>
  )
}
