import { Image, View } from '@tarojs/components'
import { navigateTo } from '@tarojs/taro'
import { useStatusHeight } from '@/hooks/useStatusHeight'
import './index.less'

export default function Index() {
  const { statusBarHeight } = useStatusHeight()

  return (
    <View className="h-full flex flex-col">
      <View
        className="pl-[20px] flex items-center h-[44px] shrink-0"
        style={{ paddingTop: `${statusBarHeight}px` }}
      >
        <Image
          src="https://obs.prod.ubanquan.cn/obs_717104887800001718248007_pre$prod-ubq"
          className="block w-[20px] h-[20px]"
          onClick={() => navigateTo({ url: '/package/pages/setting/index' })}
        />
      </View>
    </View>
  )
}
