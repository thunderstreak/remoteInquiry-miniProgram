import { useCallback } from 'react'
import Taro from '@tarojs/taro'

export const useSetting = () => {
  const handleSetting = useCallback(async () => {
    const setting = await Taro.getSetting()
    let authorize = true
    if (!setting.authSetting['scope.record']) {
      await Taro.authorize({ scope: 'scope.record' }).catch(() => {
        authorize = false
      })
    }
    if (!setting.authSetting['scope.camera']) {
      await Taro.authorize({ scope: 'scope.camera' }).catch(() => {
        authorize = false
      })
    }
    if (!setting.authSetting['scope.userLocation']) {
      await Taro.authorize({ scope: 'scope.userLocation' }).catch(() => {
        authorize = false
      })
    }
    if (!authorize) {
      return Taro.showModal({
        title: '提示',
        content: '若不授权无法使用其功能',
        cancelText: '不授权',
        confirmText: '授权'
      }).then(() => {
        Taro.openSetting()
        return false
      })
    }
    return true
  }, [])

  return {
    handleSetting
  }
}
