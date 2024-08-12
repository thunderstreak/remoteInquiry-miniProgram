import { Button, Image, Text, View } from '@tarojs/components'
import { Checkbox } from '@nutui/nutui-react-taro'
import { useCallback, useState } from 'react'
import Taro, { navigateTo, useRouter } from '@tarojs/taro'
import LoginApi from '@/api/login'
import { useStatusHeight } from '@/hooks/useStatusHeight'
import { BaseEventOrig } from '@tarojs/components/types/common'
import { TAB_BAR_PAGE_URL } from '@/constants'
import './index.less'

export default function Index() {
  const router = useRouter()
  const { statusBarHeight } = useStatusHeight()
  const [controlled, setControlled] = useState(false)

  const handlePhoneNumber = useCallback((e: BaseEventOrig) => {
    const { redirect = '' } = router.params
    const redirectUrl = decodeURIComponent(redirect)
    const { code } = e.detail
    if (code) {
      Taro.login().then(() => {
        const regex = /shareToken=([^&]+)/
        const match = redirectUrl.match(regex)
        const shareToken = match ? match[1] : undefined
        LoginApi.login({ code, appId: 'wxe1b71e689b30e39a', shareToken })
          .then((res) => {
            const { data } = res
            if (data) {
              Taro.setStorageSync('userInfo', data)
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
                Taro.switchTab({ url: '/pages/home/index' })
              }
            }
          })
      })
    }
  }, [router.params])

  const onGo = useCallback((e: BaseEventOrig, path: string) => {
    e.stopPropagation()
    navigateTo({ url: path })
  }, [])

  const onLogin = useCallback(() => {
    Taro.showToast({ title: '请先阅读并同意用户协议与隐私政策', icon: 'none' })
  }, [])
  const handleToBack = useCallback(() => {
    const pages = Taro.getCurrentPages()
    if (pages.length > 1 && Taro.getEnv() === 'WEAPP') {
      Taro.navigateBack()
    } else {
      Taro.switchTab({ url: '/pages/home/index' })
    }
  }, [])

  return (
    <View className="h-full flex flex-col items-center">
      <View
        className="h-[44px] w-full flex justify-between items-center"
        style={{ paddingTop: `${statusBarHeight}px` }}
      >
        <Text
          className="iconfont icon-back text-[24px] shrink-0 ml-[20px]"
          onClick={handleToBack}
        />
        <View className="text-[17px] font-medium flex-1 text-center" />
        <View className="w-[30px] shrink-0 mr-[20px]" />
      </View>

      <Image
        src="https://obs.prod.ubanquan.cn/obs_717104887800001717638913_pre$prod-ubq"
        className="block w-[39px] h-[43px] mt-[60px] mb-[10px] flex-center"
      />
      <Image
        src="https://obs.prod.ubanquan.cn/obs_717104887800001717639773_pre$prod-ubq"
        className="block w-[58px] h-[19px] mb-[120px] flex-center"
      />

      {controlled ? (
        <Button
          className="flex items-center justify-center w-[358px] h-[50px] bg-[#000] text-[15px] font-bold text-[#fff] rounded-[47px]"
          openType="getPhoneNumber"
          onGetPhoneNumber={handlePhoneNumber}
        >
          手机号一键登录
        </Button>
      ) : (
        <Button
          className="flex items-center justify-center w-[358px] h-[50px] bg-[#000] text-[15px] font-bold text-[#fff] rounded-[47px]"
          onClick={onLogin}
        >
          手机号一键登录
        </Button>
      )}
      <View className="mt-[20px]">
        <Checkbox
          icon={
            <Image
              src="https://obs.prod.ubanquan.cn/obs_717104887800001717581337_pre$prod-ubq"
              mode="aspectFill"
              className="w-[12px] h-[12px]"
            />
          }
          activeIcon={
            <Image
              src="https://obs.prod.ubanquan.cn/obs_717104887800001717581342_pre$prod-ubq"
              mode="aspectFill"
              className="w-[12px] h-[12px]"
            />
          }
          label=""
          checked={controlled}
          onChange={(val) => setControlled(val)}
        >
          我已阅读并同意与
          <Text
            className="font-[500] text-[#81D62C]"
            onClick={(e) => onGo(e, '/package/pages/userProtocol/index')}
          >
            《用户协议》
          </Text>
          和
          <Text
            className="font-[500] text-[#81D62C]"
            onClick={(e) => onGo(e, '/package/pages/privacyPolicy/index')}
          >
            《隐私政策》
          </Text>
        </Checkbox>
      </View>
    </View>
  )
}
