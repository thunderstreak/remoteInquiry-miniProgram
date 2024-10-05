import { useCallback, useEffect, useRef } from 'react'
import Taro from '@tarojs/taro'

// 'wss://echo.websocket.org'
export const useSocket = (options: Parameters<typeof Taro.connectSocket>) => {
  const socketTask = useRef<Taro.SocketTask | null>(null)

  const handleReceive = useCallback((callback: (data: string) => void) => {
    socketTask.current?.onMessage((res) => {
      callback(res.data)
    })
  }, [])

  const handleSend = useCallback((data: string) => {
    socketTask.current?.send({ data })
  }, [])

  const handleError = useCallback(() => {
    socketTask.current?.onError((err) =>
      Taro.showToast({ title: err.errMsg, icon: 'none' })
    )
  }, [])

  const handleClose = useCallback(() => {
    socketTask.current?.close({
      code: 1000,
      reason: '结束链接',
      complete: () => {
        console.log('链接已关闭')
      }
    })
    socketTask.current = null
  }, [])

  // 通过 WebSocket 连接发送数据。需要先 connectSocket，并在 onSocketOpen 回调之后才能发送。
  const handleCreateSocket = useCallback(async (url: string) => {
    const task = await Taro.connectSocket({ url, header: {} })
    return new Promise((resolve) => {
      task.onOpen((res) => {
        console.log(res)
        socketTask.current = task
        resolve(task)
      })
    })
  }, [])

  useEffect(() => {
    handleCreateSocket(options[0].url)
  }, [handleCreateSocket, options])

  return { handleCreateSocket, handleClose, handleSend, handleReceive, handleError }
}
