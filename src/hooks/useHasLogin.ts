import { useCallback } from 'react'
import Taro, { useRouter } from '@tarojs/taro'

export const useHasLogin = (redirectParams = '') => {
  const router = useRouter()
  const userInfo = Taro.getStorageSync('userInfo')
  const hasLogin = userInfo?.token
  const handleLogin = useCallback(() => {
    if (!hasLogin) {
      Taro.showToast({ title: '请先登录', icon: 'none' }).then(() => {
        const redirect = encodeURIComponent(
          `${router.path}${redirectParams ? '?' : ''}${redirectParams}`
        )
        Taro.navigateTo({ url: `/pages/login/index?redirect=${redirect}` })
      })
    }
  }, [hasLogin, redirectParams, router.path])

  return { hasLogin, handleLogin }
}
