import Taro from '@tarojs/taro'
import { useCallback } from 'react'
import { TAB_BAR_PAGE_URL } from '@/constants'

export const useRouteNext = () => {
  const router = Taro.useRouter()

  const routeNext = useCallback(
    (newUser: boolean = false) => {
      const { redirect = '' } = router.params
      const redirectUrl = decodeURIComponent(redirect)

      // 登录时候传递的判断参数
      if (newUser) {
        // 新用户
        const r = redirectUrl
          ? `/package/pages/user/index?redirect=${redirectUrl}`
          : '/package/pages/user/index'
        return Taro.redirectTo({ url: r })
      }
      // 非登录时候传递的判断参数
      if (redirect) {
        const [path] = redirectUrl.split('?')
        if (TAB_BAR_PAGE_URL.includes(path)) {
          Taro.switchTab({ url: redirectUrl })
        } else {
          const pages = Taro.getCurrentPages()
          if (pages.length > 1) {
            Taro.navigateBack()
          } else {
            Taro.redirectTo({ url: redirectUrl })
          }
        }
      } else {
        Taro.navigateBack()
      }
    },
    [router.params]
  )

  return [routeNext]
}
