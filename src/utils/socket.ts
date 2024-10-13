import { useCallback, useRef } from 'react'
import Taro from '@tarojs/taro'

export interface WsMessage {
  type: string;
  data: any;
}

let socketTask: Taro.SocketTask | null = null
// 'wss://echo.websocket.org'
export const useSocket = () => {
  // const socketTask = useRef<Taro.SocketTask | null>(null)
  const inter = useRef<any>(null)
  const handleOnMessage = useCallback((callback: (data: WsMessage) => void) => {
    socketTask?.onMessage<string>((res) => {
      const data = JSON.parse(res.data)
      callback(data)
    })
  }, [])

  const handleSend = useCallback((res: WsMessage) => {
    const data = JSON.stringify(res)
    socketTask?.send({ data })
  }, [])

  const handleOnError = useCallback(() => {
    socketTask?.onError((err) => {
        console.log(err)
        Taro.showToast({ title: err.errMsg, icon: 'none' })
      }
    )
  }, [])
  const handleOnClose = useCallback(() => {
    socketTask?.onClose((err) => {
        console.log(err)
        Taro.showToast({ title: err.reason, icon: 'none' })
      }
    )
  }, [])

  const handleClose = useCallback(() => {
    socketTask?.close({
      code: 1000,
      reason: '结束链接',
      complete: () => {
        console.log('链接已关闭')
      }
    })
    socketTask = null
  }, [])

  // 通过 WebSocket 连接发送数据。需要先 connectSocket，并在 onSocketOpen 回调之后才能发送。
  const handleCreateSocket = useCallback(
    async (options: Parameters<typeof Taro.connectSocket>[0]) => {
      const task = await Taro.connectSocket(options)
      return new Promise((resolve) => {
        task.onOpen(() => {
          socketTask = task
          handleOnError()
          handleOnClose()
          // 保持链接
          if (inter.current) {
            clearInterval(inter.current)
          }
          inter.current = setInterval(() => {
            handleSend({ type: 'ON_HEART_BEAT', data: Date.now() })
          }, 15000)
          resolve(task)
        })
      })
    },
    [handleOnClose, handleOnError, handleSend]
  )

  // useEffect(() => {
  //   handleCreateSocket(options[0].url)
  // }, [handleCreateSocket, options])

  return {
    handleCreateSocket,
    handleClose,
    handleOnClose,
    handleSend,
    handleOnMessage,
    handleOnError
  }
}
