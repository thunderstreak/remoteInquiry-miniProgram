import { Button, View } from "@tarojs/components"
import Taro from "@tarojs/taro"
import { useCallback, useEffect, useState } from "react"
import enforcementApi from '@/api/enforcement'
import { CallStatus, ProxyViewProps } from "./type";

export default function ProxyView(props: ProxyViewProps) {
  const { id } = props
  // 查询间隔时间
  const DOWN_NUMBER = 5;
  // 超时时间
  const TIMEOUT = 180
  const [showCallOut, setShowCallOut] = useState(true)
  const [callStatus, setCallStatus] = useState(CallStatus.NOT_CALL)
  const [time, setTime] = useState(TIMEOUT)
  const [loading, setLoading] = useState(true)
  let timer: NodeJS.Timeout | undefined
  let downTimer: NodeJS.Timeout | undefined

  const clearDownCountTimer = () => {
    if (downTimer !== undefined) {
      clearInterval(downTimer)
      downTimer = undefined
    }
  }

  const toastAndBack = useCallback((type: CallStatus) => {
    switch (type) {
      case CallStatus.CALL_FAILED:
        Taro.showToast({
          title: '本次呼叫被拒绝，即将退出',
          icon: 'none',
          duration: 3000,
        })
        break;
      case CallStatus.HUNG_UP:
        Taro.showToast({
          title: '呼叫超时，即将退出',
          icon: 'none',
          duration: 3000,
        })
        enforcementApi.timeoutNotAcceptCall({id: id})
        break;
      case CallStatus.ANSWERED:
        Taro.showToast({
          title: '案件已办理完成，即将退出',
          icon: 'success',
          duration: 3000,
        })
        break;
      default:
        break;
    }
    setTimeout(() => {
      setShowCallOut(false)
      Taro.navigateBack({
        delta: 1,
      })
    }, 3000);
  },[setShowCallOut])

  const handleCancel = () => {
   Taro.showModal({
      title: '提示',
      content: '是否取消本次呼叫？',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#999',
      confirmText: '继续等待',
      confirmColor: '#1F3FBA',
      success: (res) => {
        // 取消返回  否则什么都不做
        if (!res.confirm) {
          enforcementApi.cancelCall({id: id})
          Taro.navigateBack()
        }
      },
    })
  }

  const queryPoliceRoomInfo = useCallback(async () => {
    try {
      setLoading(true)
      const res = await enforcementApi.queryCallStatus({
        id: id,
      })
      const { isPut } = res.data || {}
      console.log('查询呼叫状态', res)
      const status = isPut as CallStatus
      setCallStatus(status)
      // 根据状态判断是否开始执法  是否中断
      if (status === CallStatus.CALL_FAILED) {
        setShowCallOut(false)
        toastAndBack(status)
      } else if (status === CallStatus.CALLED) {
        setShowCallOut(false)
      } else if (status === CallStatus.ANSWERED) {
        toastAndBack(status)
      }
    } catch (error) {}
    finally {
      setLoading(false)
    }
  }, [loading, clearDownCountTimer, toastAndBack, setShowCallOut])

  useEffect(() => {
    if (timer) {
      clearInterval(timer)
    }
    if (showCallOut) {
      let num = TIMEOUT
      timer = setInterval(() => {
        if (num === 0) {
          clearInterval(timer)
          // 呼叫超时  退出
          toastAndBack(CallStatus.HUNG_UP)
          return
        }
        num--
        setTime(time => time - 1)
      }, 1000)
    }
    return () => {
      clearInterval(timer)
    }
  }, [showCallOut])

  useEffect(() => {
    // 已办结不再轮询
    if (callStatus === CallStatus.ANSWERED) {
      clearDownCountTimer()
    } else if (!loading) {
      console.log('仅查询结束触发', loading)
      clearDownCountTimer()
      // 接听中轮询间隔调低至10秒
      let num = callStatus === CallStatus.CALLED ? 10 : DOWN_NUMBER
      downTimer = setInterval(() => {
        if (num === 0) {
          clearDownCountTimer()
          // 查询连接状态
          queryPoliceRoomInfo()
          return
        }
        num--
      }, 1000)
    }
    return () => {
      clearDownCountTimer()
    }
  }, [loading, callStatus])

  useEffect(() => {
    queryPoliceRoomInfo()
  },[])

  return (
    <View>
      {
        showCallOut && (
          <View className="w-full h-full flex flex-col items-center justify-center text-white fixed z-[9999] bg-[#1C2D3C]">
          <View className="text-[10px] font-medium">正在呼叫</View>
          <View className="text-[8px] mt-1">{time}s</View>
          <Button
            className="w-8 h-8 leading-8 mt-5 text-[8px] border border-white border-solid text-white rounded-full bg-transparent"
          onClick={handleCancel}
          >取消</Button>
        </View>
        )
      }
    </View>
  )
}
