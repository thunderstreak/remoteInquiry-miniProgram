import config from '@/config'
import { useSetting } from "@/hooks/useSetting"
import { selectUserInfo } from '@/store/slice/user'
import Taro from '@tarojs/taro'
import XYRTC from '@xylink/xy-mp-sdk'
import { useCallback } from 'react'
import { useSelector } from 'react-redux'
export default function useCreateClient() {
  const { handleSetting } = useSetting()
  const userInfo = useSelector(selectUserInfo)

  const createClient = useCallback(async (opts: { roomCode: string, roomPassword: string, id: string }, jumpType = 'navigateTo') => {
    const res = await handleSetting()
    if (!res) {
      return
    }
    console.log('接收的传参：', opts.roomCode, opts.roomPassword, opts.id)
    const XYClient = XYRTC.createClient({
      report: true,
      extId: config.DEFAULT_EXTID,
      appId: config.DEFAULT_APPID
    })
    // 登陆
    const response = await XYClient.loginExternalAccount({
      extUserId: userInfo.id,
      displayName: userInfo.userName
    })
    const { code, data = {} } = response || {}
    const { roomCode, roomPassword, id } = opts
    // 状态是200时，初始化登录成功
    if (code === 200 || code === 'XYSDK:980200') {
      const cn = data.callNumber
      console.log(cn)
      await Taro[jumpType]({
        url: `/pages/conference/index?number=${roomCode}&password=${roomPassword}&displayName=${userInfo.userName}&isProxy=${true}&audioMute=true&&caseId=${id}`
      })
    } else {
      XYClient.showToast('登录失败，请稍后重试')
    }
  }, [handleSetting])

  return {
    createClient
  }
}
