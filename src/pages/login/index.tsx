import { useEffect, useState } from 'react'
import { useRouter } from '@tarojs/taro'
import {
  ConfigProvider,
} from '@nutui/nutui-react-taro'
import config, { PlatformTypes, lightTheme } from '@/config'
import EvidenceLogin from './component/EvidenceLogin'
import EnforceLogin from './component/EnforceLogin'
import './index.less'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const { tenantCode = 'ZY001', orgCode = config.ORG_CODE } = router.params
    config.headers.tenantCode = tenantCode
    config.headers.orgCode = orgCode
  }, [router.params])

  return (
    <ConfigProvider theme={lightTheme} className="h-full">
      {
        config.PLATFORM === PlatformTypes.远程取证
          ? <EvidenceLogin />
          : <EnforceLogin />
      }
    </ConfigProvider>
  )
}
