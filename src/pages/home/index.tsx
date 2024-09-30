import { useCallback, useEffect, useRef, useState } from 'react'
import Taro, { getCurrentInstance, useRouter } from '@tarojs/taro'
import XYRTC from '@xylink/xy-mp-sdk'
import './index.less'

export default function Index() {
  const router = useRouter()
  const [state, setState] = useState({ meetingLoading: false })
  const XYClient = useRef<ReturnType<typeof XYRTC.createClient>>()
  const handleOnRoomEvent = (event) => {
    console.log(event)
    const { type, detail } = event.detail

    switch (type) {
      case 'connected':
        // 入会成功消息
        console.log('demo get connected message: ', detail)
        this.data.localCallUri = detail.callUri
        // 开始计算会议时长
        this.onCreateMeetingTimeCount()
        // 订阅参会者
        XYClient.current?.subscribeBulkRoster()
        // 五秒后收起会议操作调
        this.resetOperateBarTimmer()
        break
      case 'disconnected':
        // 退出会议消息
        console.log('demo get disconnected message: ', detail)
        this.disConnectMeeting(detail)
        break
      case 'meetingInfo':
        // 会议相关信息，包含会议ID、会议邀请信息等
        console.log('demo get meetingInfo message', detail)
        this.setData({ meetingInfo: detail })
        break
      case 'roomChange':
        // live-pusher推流状态消息
        console.log('demo get live-pusher status change message: ', detail)

        break
      case 'onHold':
        // 被会控移入等候室，当前参会者无法接收到远端的声音和画面，本地画面和声音也无法发送
        console.log('demo get onHold message: ', detail)

        this.setData({ onHold: detail })
        // 进入等候室
        if (detail) {
          console.log(
            this.data.audioMuted,
            this.data.camera,
            '进入等候音视频状态'
          )
          this.setData({
            holdCamera: !this.data.camera,
            holdAudioMuted: this.data.audioMuted
          })
        } else {
          console.log(
            this.data.holdAudioMuted,
            this.data.holdCamera,
            '进入会议音视频状态'
          )

          this.setData({
            camera: !this.data.holdCamera,
            audioMuted: this.data.holdAudioMuted
          })
          this.muteStatus()
        }

        break
      case 'roster':
        // 参会者列表数据，当有人员变动或者状态变动，会实时推送最新的列表数据
        console.log('demo get roster message: ', detail)

        this.setData({ total: detail.participantsNum })
        // 自动布局不需要处理Roster数据
        if (this.data.template.layout !== 'custom') {
          return
        }

        this.handleCustomLayout(detail)
        break
      case 'bulkRoster':
        // 全量参会者列表数据
        console.log('demo get bulkRoster message: ', detail)
        this.data.rosterList = detail
        this.bindSearch({ detail: { value: this.data.searchVal } })

        break
      case 'netQualityLevel':
        // 网络质量等级
        console.log('demo get netQualityLevel: ', detail)

        break
      case 'audioStatus':
        // 推送实时麦克风状态，最新的麦克风状态请以此为准
        console.log('demo get audio status: ', detail)

        this.setData({ audioMuted: detail })
        break
      case 'confMgmt':
        // 会控消息
        console.log('demo get 会控消息：', detail)

        const { muteOperation, disableMute } = detail
        this.showAudioStatus(muteOperation, disableMute)
        break
      case 'eventClick':
        // 画面点击事件
        console.log('demo get eventClick message：', detail)

        break
      case 'eventLongPress':
        // 画面长按事件
        console.log('demo get eventLongPress message：', detail)
        break
      case 'eventDoubleClick':
        // 画面双击事件
        console.log('demo get eventDoubleClick message：', detail)
        break
      case 'speakersInfo':
        // 当前讲话人信息
        console.log('demo get speakersInfo message：', detail)
        break
      case 'networkParameter':
        // 网络质量等级
        console.log('networkParameter msg:', detail)
        break
      case 'networkLevel':
        // 监听本地端网络质量等级
        console.log('networkLevel msg:', detail)
        this.setData({ localNetworkLevel: detail })
        break
      case 'meetingStats':
        // 参会者网络质量数据
        console.log('meetingStats msg:', detail)
        this.handleNetInfo(detail)
        break
      case 'content':
        // 当前共享content的参会者信息
        console.log('content msg:', detail)
        this.data.content = detail || {}
        break
      default: {
        console.log('demo get other message: ', event.detail)
      }
    }
  }

  const handleInit = useCallback(async () => {
    // XYRTC.createClient()创建了一个单例对象client，在多个小程序页面之间共享一个实例，可以重复调用获取最新的实例；
    XYClient.current = XYRTC.createClient({
      // 目的是排除底部40px空间，显示操作条
      container: { offset: [0, 40, 0, 0] },
      report: true
    })
    // 配置-获取邀请链接，参会者头像
    XYClient.current.setFeatureConfig({
      enableLayoutAvatar: true,
      enableMeetingInvite: true
    })
    // 发起SDK呼叫，通过回调获取结果
    // 此处请参考API文档，新版本新增其他配置参数
    const response = await XYClient.current.makeCall({
      number: router.params.number ?? '',
      password: router.params.password,
      displayName: router.params.displayName
    })
    console.log(response)
    const { code, message = '' } = response
    // 隐藏呼叫Loading
    setState((v) => ({ ...v, meetingLoading: true }))

    // 缓存sdk <xylink-sdk/>组件节点context，为后续调用组件内部方法用
    const { page } = getCurrentInstance()
    const XYLinkRoom = page?.selectComponent?.('#xylink') as any
    // const XYLinkRoom = this.selectComponent('#xylink')
    // 支持content画面缩放
    if (XYLinkRoom) {
      XYLinkRoom.setViewZoom({ enablePinchToZoom: true })
    }

    // 最新的逻辑仅需要处理异常呼叫入会即可，其他逻辑不需要再处理
    if (code !== 200) {
      XYClient.current.showToast(message, () => {
        // 退出呼叫页面
        Taro.navigateBack({ delta: 1 })
      })
    }
  }, [router.params.displayName, router.params.number, router.params.password])

  useEffect(() => {
    handleInit()
  }, [handleInit])

  return (
    <view className="h-full">
      <xylink-room
        template={{ layout: 'auto', detail: [] }}
        beauty={6}
        muted={false}
        camera={!false}
        devicePosition="front"
        id="xylink"
        bindonRoomEvent={handleOnRoomEvent}
      />
    </view>
  )
}
