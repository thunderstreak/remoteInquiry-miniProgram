import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Image, LivePlayer, LivePusher, View } from '@tarojs/components'
import XYRTC, { LayoutInfo, LayoutMode } from '@xylink/xy-mp-sdk'
import { ConferenceStates } from '@/pages/conference/type'
import { getDeviceAvatar, getNetworkLevelImage } from '@/utils/meeting'
import { useTimer } from '@/utils/useTime'
import { Event } from '@/utils'
import { useSocket } from '@/utils/socket'
import './index.less'
import ProxyView from './components/ProxyView'

export default function Index() {
  const { startStopTimer, formatTime } = useTimer(0)
  const router = useRouter()
  const { handleCreateSocket, handleOnMessage, handleClose } = useSocket()
  const [state, setState] = useState<ConferenceStates>({
    loading: true,
    pushUrl: '', // 推流地址
    isPushed: false, // 是否已完成推流
    videoMute: false, // 本地摄像头是否关闭
    audioMute: false, // 本地麦克风是否关闭
    localNetworkLevel: 4, // 本地网络信号等级
    remoteNetworkLevel: {}, // 远端网络信号等级
    onHold: false, // 是否在等候室
    isShowDetected: false, //
    // roster: {}, //  会中roster信息
    layout: [], // 布局对象
    layoutMode: LayoutMode.AUTO // 布局模式
  })
  const XYClient = useRef<ReturnType<typeof XYRTC.createClient>>()

  /** 是否代理 --- 接听成功、挂断等状态需额外处理（云执法） */
  const isProxy = useMemo(() => {
    const { isProxy = 'false' } = router.params
    return JSON.parse(isProxy)
  }, [router.params])

  const caseId = useMemo(() => {
    const { caseId = '' } = router.params
    return caseId
  }, [router.params])

  const localAudioImg = useMemo(
    () =>
      state.audioMute
        ? require('../../assets/images/audio_mute.png')
        : require('../../assets/images/audio_unmute.png'),
    [state.audioMute]
  )

  const localVideoImg = useMemo(
    () =>
      state.videoMute
        ? require('../../assets/images/video_unmute.png')
        : require('../../assets/images/video_mute.png'),
    [state.videoMute]
  )

  const signal = useMemo(
    () => getNetworkLevelImage(state.localNetworkLevel),
    [state.localNetworkLevel]
  )

  const newLayout = useMemo(() => {
    return state.layout?.map((item: LayoutInfo) => {
      const audioImg = item.roster.audioTxMute
        ? require('../../assets/images/audio_mute.png')
        : require('../../assets/images/audio_unmute.png')
      const defaultAvatar = getDeviceAvatar(item.roster.deviceType)
      const avatar = item.avatar || defaultAvatar

      const networkLevel =
        state.remoteNetworkLevel[item.roster.callUri || ''] || 4
      const networkLevelImage = getNetworkLevelImage(networkLevel)

      return {
        ...item,
        audioImg,
        avatar,
        networkLevel,
        networkLevelImage
      }
    })
  }, [state.layout, state.remoteNetworkLevel])

  /**
   * live-pusher 网络状态通知
   */
  const handleNetStatus = useCallback((e) => {
    XYClient.current?.pusherNetStatusHandler(e)
  }, [])
  /**
   * live-pusher 状态变化事件
   */
  const handlePusherStatechange = useCallback((e) => {
    XYClient.current?.pusherEventHandler(e)
  }, [])
  /**
   * live-pusher 渲染错误事件
   */
  const handlePusherError = useCallback((e) => {
    XYClient.current?.pusherErrorHandler(e)
  }, [])
  /**
   * live-pusher 返回麦克风采集的音量大小
   */
  const handlePusherAudioVolumeNotify = useCallback((e) => {
    XYClient.current?.pusherAudioVolumeNotify(e)
  }, [])

  /**
   * live-player 播放状态变化事件
   */
  const handlePlayStateChange = useCallback((e) => {
    XYClient.current?.playerEventHandler(e)
  }, [])
  /**
   * live-player 网络状态通知
   */
  const handlePlayNetStatus = useCallback((e) => {
    XYClient.current?.playNetStatusHandler(e)
  }, [])
  /**
   * live-player 播放音量大小通知
   */
  const handlePlayAudioVolumeNotify = useCallback((e) => {
    XYClient.current?.playAudioVolumeNotify(e)
  }, [])

  const handleOperateAudio = useCallback(() => {
    if (XYClient.current) {
      XYClient.current[state.audioMute ? 'unmuteAudio' : 'muteAudio']()
    }
  }, [state.audioMute])

  /**
   * 开启/关闭摄像头
   */
  const handleOperateVideo = useCallback(() => {
    if (XYClient.current) {
      XYClient.current[state.videoMute ? 'unmuteVideo' : 'muteVideo']()

      state.videoMute = !state.videoMute
    }
  }, [state])

  /**
   * 切换摄像头
   */
  const handleSwitchCamera = useCallback(() => {
    XYClient.current?.switchCamera()
  }, [])

  /**
   * 双击 forceLayout
   */
  const handleFullScreenContent = useCallback((data, e) => {
    Event.click(e, () => {
      XYClient.current?.handleFullScreen(data)
    })
  }, [])

  // 挂断会议
  const hangup = useCallback(() => {
    XYClient.current?.hangup()
    XYClient.current?.off('roomEvent')
    handleClose() // 关闭ws链接
    Taro.navigateBack({ delta: 1 })
  }, [handleClose])

  /**
   * 授权状态更新，需要重新入会
   */
  const exitRoom = useCallback(
    (msg = '') => {
      if (msg) {
        Taro.showModal({
          title: '提示', // 提示的标题,
          content: msg, // 提示的内容,
          showCancel: false, // 是否显示取消按钮,
          confirmText: '退出会议', // 确定按钮的文字，默认为取消，最多 4 个字符,
          confirmColor: '#3876FF' // 确定按钮的文字颜色,
        }).then(hangup)
      } else {
        hangup()
      }
    },
    [hangup]
  )

  const handleOnRoomEvent = useCallback(
    (event) => {
      // console.log(event)
      const { type, detail } = event
      switch (type) {
        // 入会成功消息
        case 'connected':
          setState((v) => ({ ...v, loading: false, connected: true }))
          startStopTimer()
          break
        // 退出会议消息
        case 'disconnected':
          const { message } = detail
          setState((v) => ({ ...v, loading: false }))

          if (message) {
            // 存在message消息，则直接提示，默认3s后退会会议界面
            // 注意此处的message可以直接用做展示使用，不需要开发者再进行错误码的匹配
            XYClient.current?.showToast(message, () => {
              hangup()
            })
          } else {
            // 不存在message消息，直接退会
            hangup()
          }
          break
        // 会议信息，包含会议号、会议名称、邀请信息等
        case 'meetingInfo':
          setState((v) => ({ ...v, meetingInfo: detail }))
          break
        // 被会控移入等候室，当前参会者无法接收到远端的声音和画面，本地画面和声音也无法发送
        case 'onHold':
          setState((v) => ({ ...v, onHold: detail }))
          break
        // 获取到推流地址事件
        case 'pushUrl':
          setState((v) => ({ ...v, pushUrl: detail }))
          // 切记，需要等待推流地址设置完成后，再启动本地推流
          XYClient.current?.startLivePusher(
            () => {
              setState((v) => ({ ...v, isPushed: true }))
            },
            (err: any) => {
              console.log(err)
            }
          )

          break
        // 参会者列表数据，当有人员变动或者状态变动，会实时推送最新的列表数据
        case 'roster':
          setState((v) => ({ ...v, roster: detail }))
          // if (layoutMode.value === 'custom') {
          //   handleCustomLayout(detail)
          // }

          break
        // 权限被拒异常处理
        case 'permission':
          Taro.showToast({
            title: '请开启“麦克风”和“摄像头”权限才可以进行音视频通话！',
            icon: 'error'
          })
          break
        // 自动布局/自定义布局上报布局结果，基于此数据渲染画面
        case 'layout':
          setState((v) => ({ ...v, layout: detail }))
          break
        // 共享Content数据
        case 'content':
          break
        // 推送实时麦克风状态，最新的麦克风状态请以此为准
        case 'audioStatus':
          setState((v) => ({ ...v, audioMute: detail }))
          break
        // pusher渲染错误
        case 'pusherError':
          exitRoom('异常退出，请尝试重新入会')
          break
        // 会中所有终端信息
        case 'bulkRoster':
          setState((v) => ({ ...v, bulkRoster: detail }))
          break
        case 'networkParameter':
          setState((v) => ({
            ...v,
            remoteNetworkLevel: {
              ...v.remoteNetworkLevel,
              [detail.fromCallUri]: detail.networkLevel
            }
          }))
          break
        case 'networkLevel':
          setState((v) => ({ ...v, localNetworkLevel: detail }))
          break
        default:
          break
      }
    },
    [exitRoom, hangup]
  )

  const handleInit = useCallback(async () => {
    // XYRTC.createClient()创建了一个单例对象client，在多个小程序页面之间共享一个实例，可以重复调用获取最新的实例；
    XYClient.current = XYRTC.createClient({
      // 目的是排除底部40px空间，显示操作条
      container: { offset: [40, 40, 0, 0] },
      report: true
    })
    // 设置布局模式
    XYClient.current?.setLayoutMode(state.layoutMode)
    // 事件监听
    XYClient.current.on('roomEvent', handleOnRoomEvent)
    // 配置-获取邀请链接，参会者头像
    XYClient.current.setFeatureConfig({
      enableLayoutAvatar: true,
      enableMeetingInvite: true
    })
    // 发起SDK呼叫，通过回调获取结果
    // 此处请参考API文档，新版本新增其他配置参数
    const {
      number = '',
      password = '',
      displayName = '',
      videoMute = 'false',
      audioMute = 'false'
    } = router.params
    // 隐藏呼叫Loading
    setState((v) => ({
      ...v,
      loading: true,
      videoMute: JSON.parse(videoMute),
      audioMute: JSON.parse(audioMute)
    }))
    const response = await XYClient.current.makeCall({
      number: number,
      password: password,
      displayName: displayName
    })
    // console.log(response)
    const { code, message = '' } = response

    // 缓存sdk <xylink-sdk/>组件节点context，为后续调用组件内部方法用
    // const { page } = getCurrentInstance()
    // const XYLinkRoom = page?.selectComponent?.('#xylink') as any
    // 支持content画面缩放
    // if (XYLinkRoom) {
    //   XYLinkRoom.setViewZoom({ enablePinchToZoom: true })
    // }

    // 最新的逻辑仅需要处理异常呼叫入会即可，其他逻辑不需要再处理
    if (code !== 200) {
      XYClient.current.showToast(message, () => {
        // 退出呼叫页面
        Taro.navigateBack({ delta: 1 })
      })
    }
  }, [handleOnRoomEvent, router.params, state.layoutMode])

  useEffect(() => {
    handleInit()
  }, [handleInit])

  useEffect(() => {
    const { lawId } = router.params
    if (lawId) {
      const wsUrl = `${process.env.TARO_APP_API.replace(
        'https',
        'wss'
      )}/api/ws/${lawId}`
      handleCreateSocket({ url: wsUrl }).then(() => {
        handleOnMessage((res) => {
          const { type, data } = res
          // console.log(data)
          switch (type) {
            case 'NOTICE_SIGN_NAME': // 通知签名
            case 'NOTICE_SIGN_TIME': // 通知签日期
            case 'NOTICE_SIGN_MARK': // 通知签备注
              Taro.setStorageSync(type, data)
              const suffix = type.replace('NOTICE', 'ON')
              Taro.navigateTo({ url: `/pages/sign/index?type=${suffix}` })
              break
            case 'NOTICE_UPLOAD': // 通知上传证据
              Taro.navigateTo({ url: '/pages/photo/index' })
              break
            case 'NOTICE_CLOSE': // 关闭询问
              Taro.showModal({
                title: '提示',
                content: '远程取证已结束!',
                showCancel: false,
                confirmText: '确定'
              }).then(({ confirm }) => {
                if (confirm) {
                  hangup()
                }
              })
              break
          }
        })
      })
    }
  }, [handleCreateSocket, handleOnMessage, hangup, router.params])

  return (
    <View className="h-full w-full text-white relative bg-[#1f1f25]">
      {isProxy && caseId !== '' && (
          <ProxyView id={caseId} />
        )
      }
      {state.loading && (
        <View className="xy__call">
          <View className="xy__call-box">
            <Image
              className="xy__call-image"
              src={require('../../assets/images/device/noicon.png')}
            />
            <View className="xy__call-name">呼叫中...</View>
            <View className="xy__call-end" onClick={hangup}>
              <View className="xy__call-wrap-img">
                <Image
                  src={require('../../assets/images/action_hangup.png')}
                  className="img"
                />
              </View>
            </View>
          </View>
        </View>
      )}
      {newLayout?.map((x, i) => (
        <View key={i}>
          {/* 本地端画面*/}
          {x.isPusher ? (
            <View
              className="video"
              style={x.style}
              onClick={(e) => handleFullScreenContent(x, e)}
            >
              {state.pushUrl && (
                <LivePusher
                  className="video-player"
                  id="pusher"
                  url={state.pushUrl}
                  enableCamera={!state.videoMute && state.isPushed}
                  muted={state.audioMute}
                  onNetStatus={handleNetStatus}
                  onStateChange={handlePusherStatechange}
                  onError={handlePusherError}
                  onAudioVolumeNotify={handlePusherAudioVolumeNotify}
                />
              )}
              <View className="video-status">
                <Image className="video-mute-icon" src={localAudioImg} />
                {state.localNetworkLevel < 3 && (
                  <Image className="video-signal" src={signal} />
                )}
                <View className="video-member">{x.roster.displayName}</View>
              </View>

              {!(state.pushUrl && state.isPushed) && !state.videoMute && (
                <View className="video-bg">
                  <View className="video-pause-box">
                    <View> 获取推流中...</View>
                  </View>
                </View>
              )}
              {state.pushUrl && state.videoMute && (
                <View className="video-bg">
                  <View className="video-pause-box">
                    <Image
                      className={x.seat === 0 ? 'big-avatar' : 'video-avatar'}
                      src={x.avatar}
                    />
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View
              className="video"
              style={x.style}
              onClick={(e) => handleFullScreenContent(x, e)}
            >
              {x.playUrl && (
                <LivePlayer
                  id={x.id}
                  className="video-player"
                  src={x.playUrl}
                  mode="RTC"
                  data-item={x}
                  autoplay
                  autoPauseIfOpenNative={false}
                  autoPauseIfNavigate={false}
                  objectFit="fillCrop"
                  onStateChange={handlePlayStateChange}
                  onNetStatus={handlePlayNetStatus}
                  onAudioVolumeNotify={handlePlayAudioVolumeNotify}
                />
              )}

              <View className="video-status">
                {!x.roster.isContent && (
                  <Image className="video-mute-icon" src={x.audioImg} />
                )}
                {x.networkLevel && x.networkLevel < 3 && (
                  <Image className="video-signal" src={x.networkLevelImage} />
                )}
                <View className="video-member">{x.roster.displayName}</View>
              </View>

              {(x.roster.isContent && x.roster.videoTxMute) ||
              x.roster.deviceType === 'pstngw' ||
              x.roster.deviceType === 'tel' ? (
                <View className="video-bg">
                  <View className="video-pause-box">
                    <View className="video-name">{x.roster.displayName}</View>
                    <View> 语音通话中</View>
                  </View>
                </View>
              ) : x.playUrl && !x.roster.videoTxMute && x.status === 'start' ? (
                <View className="video-cover-view" />
              ) : x.roster.videoTxMute ? (
                <View className="video-bg">
                  <View className="video-pause-box">
                    <Image
                      className={x.seat === 0 ? 'big-avatar' : 'video-avatar'}
                      src={x.avatar}
                    />
                  </View>
                </View>
              ) : (
                <View className="video-bg">
                  <View className="video-pause-box">
                    {x.roster.isContent ? '共享内容请求中...' : '视频请求中...'}
                  </View>
                </View>
              )}
            </View>
          )}
          {/* 远端所有画面*/}
        </View>
      ))}
      {/* 操作条 */}
      {!state.loading && !state.onHold && (
        <View className="xy__operate-container">
          {/* 下部的操作条 */}
          <View className="xy__operate xy__operate-left">
            <View
              className={`xy__operate-btn ${
                state.videoMute ? 'xy__operate-btn-disabled' : ''
              }`}
              onClick={handleSwitchCamera}
            >
              <Image
                className="icon"
                src={require('../../assets/images/icon_switch.png')}
              />
              <View className="xy__operate-font">翻转</View>
            </View>

            <View className="xy__operate-btn" onClick={handleOperateAudio}>
              <Image className="icon" src={localAudioImg} />
              <View className="xy__operate-font">
                {state.audioMute ? '取消静音' : '静音'}
              </View>
            </View>

            <View className="xy__operate-btn" onClick={handleOperateVideo}>
              <Image className="icon" src={localVideoImg} />
              <View className="xy__operate-font">
                {state.videoMute ? '开启视频' : '关闭视频'}
              </View>
            </View>
            <View className="xy__operate-end" onClick={hangup}>
              挂断
            </View>
          </View>
          {/* 上部操作条*/}
          <View className="xy__operate xy__operate-right">
            <View className="xy__operate-signal">
              <Image src={signal} />
            </View>

            <View className="xy__operate-time">{formatTime()}</View>

            <View className="xy__operate-btn xy__operate-info">
              <View className="xy__operate-number">
                {state.meetingInfo?.callNumber}
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  )
}
