import { useCallback, useEffect } from 'react'
import Taro from '@tarojs/taro'
import './index.less'

export default function Index() {
  const handleSetting = useCallback(async () => {
    const setting = await Taro.getSetting()
    if (!setting.authSetting['scope.record']) {
      await Taro.authorize({ scope: 'scope.record' })
    }
    if (!setting.authSetting['scope.userLocation']) {
      await Taro.authorize({ scope: 'scope.userLocation' })
    }
    if (!setting.authSetting['scope.camera']) {
      await Taro.authorize({ scope: 'scope.camera' })
    }
  }, [])

  useEffect(() => {
    handleSetting().catch(console.log)
  }, [handleSetting])

  return <view className="h-full text-[red]">index</view>
}
