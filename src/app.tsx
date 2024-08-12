import { PropsWithChildren, ReactNode } from 'react'
import { useLaunch } from '@tarojs/taro'
import { Provider } from 'react-redux'
import { store } from '@/store'
import './app.less'

const App = ({ children }: PropsWithChildren<any>): ReactNode => {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return <Provider store={store}>{children}</Provider>
}

export default App
