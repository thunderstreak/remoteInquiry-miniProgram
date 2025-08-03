import { PreviewFingerProps } from './type'
import { Popup } from "@nutui/nutui-react-taro"
import { View, Image, Text, Button } from "@tarojs/components"

export default function PreviewFinger(props: PreviewFingerProps) {
  const { fingerUrl, visible, onClose } = props

  return (
    <Popup
        visible={visible}
        position="center"
        onClose={() => {
          onClose(false)
        }}
      >
        <View className="flex flex-col items-center bg-white rounded-[40px] py-5 w-[300px]">
          <View className='text-center text-[#333] text-[16px] font-bold h-[50px] leading-[50px]'>查看指纹</View>
          <Image
            className="w-60 h-60"
            src={fingerUrl}
            />
          <Button
            className='w-40 mt-4 bg-[#3777E1] text-white !h-[40px] leading-[40px] !rounded-[10px] border-0 text-[14px]'
            onClick={() => onClose(false)}
          >
            关闭
          </Button>
        </View>
    </Popup>
  )
}
