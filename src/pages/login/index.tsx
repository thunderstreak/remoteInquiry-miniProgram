import { useEffect, useState } from 'react'
import { useRouter } from '@tarojs/taro'
import {
  ConfigProvider,
} from '@nutui/nutui-react-taro'
import config, { lightTheme } from '@/config'
import EvidenceLogin from './component/EvidenceLogin'
import EnforceLogin from './component/EnforceLogin'
import { PlatformTypes } from './type'
import './index.less'

export default function Index() {
  const [platform, setPlatform] = useState<PlatformTypes>(PlatformTypes.远程取证)
  const router = useRouter()

  useEffect(() => {
    const { tenantCode = 'ZY001', orgCode = 'Z01' } = router.params
    config.headers.tenantCode = tenantCode
    config.headers.orgCode = orgCode
    const enforceIncludes = ['Z02']
    if (enforceIncludes.includes(orgCode)) {
      setPlatform(PlatformTypes.交警云执法)
    }
  }, [router.params])

  return (
    <ConfigProvider theme={lightTheme} className="h-full">
      {
        platform === PlatformTypes.远程取证
          ? <EvidenceLogin />
          : <EnforceLogin />
      }
    </ConfigProvider>
  )
}
