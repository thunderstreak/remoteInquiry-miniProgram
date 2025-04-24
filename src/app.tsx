import { PropsWithChildren, ReactNode, useCallback } from 'react'
import Taro, { useLaunch } from '@tarojs/taro'
import { Provider } from 'react-redux'
import { store } from '@/store'
import './app.less'

const App = ({ children }: PropsWithChildren<any>): ReactNode => {
  useLaunch(async () => {
    console.log('App launched.')
    await Taro.setVisualEffectOnCapture({
      visualEffect: 'hidden',
      success: () => {
        // Taro.showToast({ title: '禁止截屏', icon: 'none' }).catch(console.log)
      }
    })

    const res = Taro.getDeviceInfo()
    if (res.platform === 'ios') {
      handleGetScreenRecordingState()
    }
  })

  const handleGetScreenRecordingState = useCallback(() => {
    Taro.getScreenRecordingState().then((res) => {
      if (res.state === 'on') {
        Taro.showModal({
          content: '此页面不允许录屏!',
          showCancel: false
        }).then(({ confirm }) => {
          if (confirm) {
            Taro.switchTab({ url: '/pages/home/index' }).catch(console.log)
          }
        })
      }
    })
  }, [])

  // children 是将要会渲染的页面
  return <Provider store={store}>{children}</Provider>
}

export default App
