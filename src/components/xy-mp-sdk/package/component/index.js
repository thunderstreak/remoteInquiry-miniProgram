/**
 * 小鱼易连小程序SDK <xylink-room /> 组件
 *
 * 此组件是通过SDK非UI模式封装实现，整体流程可以作为开发者参考非UI模式的实现细节
 *
 * @authors Luo-jinghui、Chengfei (luojinghui424@gmail.com)
 * @date  2018-11-27 15:59:48
 */
import { computedBehavior } from './utils/computed'
import { XYRTC } from '../index'
import ZoomUtil from './utils/ZoomUtil'

Component({
  // 关闭样式隔离，此值表示页面 wxss 样式将影响到自定义组件，但自定义组件 wxss 中指定的样式不会影响页面；
  options: {
    styleIsolation: 'apply-shared'
  },
  // 由于小程序不支持计算属性，需要添加计算属性插件实现
  // 第三方框架如果携带此能力，则直接使用即可
  behaviors: [computedBehavior],
  // 组件Props属性管理
  properties: {
    // 美颜级别
    beauty: { type: Number, value: 5 },
    // 美白级别
    whiteness: { type: Number, value: 5 },
    // 是否关闭麦克风，默认false开启
    muted: {
      type: Boolean,
      value: false,
      observer() {
        this.onSwitchAudioMute()
      }
    },
    // 是否自动调用开启/关闭摄像头方法，默认是true，开启，false代表关闭，则需要业务上自行调用unmuteVideo/muteVideo方法
    mutedAtuoOperate: {
      type: Boolean,
      value: true
    },
    // 是否关闭摄像头，默认false关闭
    camera: {
      type: Boolean,
      value: false,
      observer() {
        this.onSwitchVideoMute()
      }
    },
    // 设置前/后置摄像头
    devicePosition: { type: String, value: 'front' },
    // 挂起图片
    waitingImage: {
      type: String,
      value: 'https://sdk-source.xylink.com/miniProgram/waitingImage.png'
    },
    // 背景图片
    backgroundImage: {
      type: String,
      value: 'https://sdk-source.xylink.com/miniProgram/meeting_bg_720.jpg'
    },
    // 自定义布局，动态改变模版
    template: {
      type: Object,
      value: { layout: 'auto', detail: [] },
      observer(newVal) {
        this.logger.log('[component] template change value: ', newVal)
        const detail = newVal ? newVal.detail : []
        const layoutMode = newVal ? newVal.layout : 'auto'

        if (layoutMode === 'auto' && !this.XYClient) {
          return
        }

        this.XYClient.setLayoutMode(layoutMode).updateTemplate(detail)
      }
    },
    // 是否开启调试模式
    debug: {
      type: Boolean,
      value: false
    }
  },
  // 响应式Data
  data: {
    // 是否显示<xylink-room />组件
    display: false,
    // Layout布局列表数据
    layout: [],
    // 是否移入等候室
    onHold: false,
    // 是否已经启动推流
    isPushed: false,
    // live-pusher最大码率
    maxBitrate: 1000,
    // live-pusher最小码率
    minBitrate: 80,
    // mode
    mode: 'RTC',
    // 拖拽
    dragOffset: { x: 0, y: 0 },
    scale: 1,
    enablePinchToZoom: false
  },
  // 计算属性
  computed: {
    show() {
      return this.data.display ? 'xy-room' : 'xy-room xy-hide'
    },
    newLayout() {
      let layoutMode = 'auto'

      if (this.XYClient) {
        layoutMode = this.XYClient.getLayoutMode()
      }

      const layoutLen = this.data.layout.length

      const layout = this.data.layout.map((item) => {
        const { style, roster, seat } = item
        const {
          displayName,
          isActiveSpeaker,
          audioTxMute,
          isContent,
          videoTxMute,
          deviceType
        } = roster || {}
        let name = item.name
        let newStyle = style || ''
        // 是否是语音通话
        const isAudioCall =
          (isContent && videoTxMute) ||
          deviceType === 'pstngw' ||
          deviceType === 'tel'

        // 【UI模式】自动布局下，针对Content下的语音激励人员标记篮框
        if (layoutMode === 'auto') {
          // 自动布局使用的是Roster中的displayName
          name = displayName

          if (this.content.userId && isActiveSpeaker && !audioTxMute) {
            newStyle = newStyle.concat(
              `border: 2px solid #44b5ff; box-sizing: border-box;`
            )
          } else {
            // 否则清理篮框标记
            newStyle = newStyle.concat(`border: none; box-sizing: border-box;`)
          }
        }

        let videoStyle = ''
        let avatarStyle = 'width: 44px;height:44px'

        if (item.roster.isContent && this.data.enablePinchToZoom) {
          const { x, y } = this.data.dragOffset
          videoStyle = `transform: matrix(${this.data.scale}, 0, 0, ${this.data.scale}, ${x}, ${y});`
        }
        // 大屏
        if (seat === 0 || layoutLen === 1) {
          avatarStyle = 'width: 72px;height:72px'
        }

        // 画面填充模式为图像铺满屏幕，避免出现黑边问题
        // content为保准分享内容完整，不进行裁剪
        const fit = item.roster.isContent ? 'contain' : 'fillCrop'
        const muted = !!item.roster.muted

        const newItem = Object.assign({}, item, {
          fit,
          muted,
          name,
          style: newStyle,
          videoStyle,
          avatarStyle,
          isAudioCall
        })

        return newItem
      })

      if (this.logger) {
        this.logger.log('[component] new layout:', layout)
      }

      return layout
    },
    onholdStyle() {
      return this.data.onHold ? 'position: fixed; visibility: hidden;' : ''
    }
  },
  // 组件所在页面的生命周期函数
  pageLifetimes: {
    // 组件所在的页面被展示时执行
    show() {
      // 页面被展示
      this.logger.log('[component] page show')

      // 从后台切到前台，需要重新恢复推流，否则本地和远端可能会黑屏
      setTimeout(() => {
        this.XYClient.startLivePlayer()
      }, 500)

      this.XYClient.report('sta-confStatus', 'pageStatus', {
        status: 'show'
      })
    },
    // 组件所在的页面被隐藏时执行
    hide() {
      this.logger.log('[component] page hide')

      this.XYClient.report('sta-confStatus', 'pageStatus', {
        status: 'hide'
      })
    }
  },
  // 生命周期函数
  lifetimes: {
    // 在组件在视图层布局完成后执行
    ready() {
      this.logger.log('[component] page ready')
    },
    // 在组件实例进入页面节点树时执行
    attached() {
      this.logger.log('[component] page attached')
    },
    // 在组件实例被从页面节点树移除时执行
    detached() {
      this.logger.log('[component] page detached')
      // 组件销毁时，掉用SDK挂断会议方法
      this.XYClient.hangup()

      if (this.zoomUtilInstance) {
        // 销毁content缩放方法
        this.zoomUtilInstance.destroy()

        this.zoomUtilInstance = null
      }
    }
  },
  created() {
    // 是否开启了权限设置提示
    this.isShowDetected = false
    // 缓存共享Content的数据
    this.content = {}

    // xyRTC初始化
    this.initRTCEvent()
  },
  methods: {
    /**
     * 【UI组件】参会者画面单击、双击画面事件
     *
     * @param { IRoster } params - 参会者画面信息
     */
    onClickContent(params) {
      const currentTime = params.timeStamp
      const lastTapTime = this.lastTapTime
      this.lastTapTime = currentTime

      if (currentTime - lastTapTime < 250) {
        this.onFullScreenContent(params)
        this.postEvent('eventDoubleClick', params)
        clearTimeout(this.lastTapTimeoutFunc)
      } else {
        this.lastTapTimeoutFunc = setTimeout(() => {
          this.postEvent('eventClick', params)
        }, 250)
      }
    },

    /**
     * 【UI组件】参会者画面长按事件
     *
     * @param { IRoster } params - 参会者画面信息
     */
    onLongPress(params) {
      this.logger.log('onLongPress:', params)
      this.postEvent('eventLongPress', params)
    },

    /**
     * 【UI组件】全屏显示画面
     *
     * @param { * } params - 切换全屏画面
     */
    onFullScreenContent(params) {
      this.logger.log('[component] onFullScreenContent:', params)

      const item = params.currentTarget.dataset.item

      this.XYClient.handleFullScreen(item)
    },

    /**
     * 【UI组件】静音/取消静音操作
     *
     * @public
     */
    onSwitchAudioMute() {
      this.logger.log('[component] onSwitchAudioMute muted:', this.data.muted)

      if (!this.XYClient) {
        this.logger.log('rejected switch audio mute')
        return
      }

      // 根据组件推送的最新状态，调用接口，通知远端
      if (this.data.muted) {
        this.XYClient.muteAudio()
      } else {
        this.XYClient.unmuteAudio()
      }
    },

    /**
     * 开启/关闭视频
     *
     * @public
     */
    onSwitchVideoMute() {
      this.logger.log(
        '[component] onSwitchAudioMute camera:',
        this.data.camera
      )

      if (!this.XYClient || !this.data.mutedAtuoOperate) {
        this.logger.log(
          'rejected switch video mute: ',
          this.data.mutedAtuoOperate
        )
        return
      }

      // 根据组件推送的最新状态，调用接口，通知远端
      if (this.data.camera) {
        this.XYClient.unmuteVideo()
      } else {
        this.XYClient.muteVideo()
      }
    },

    /**
     * 【UI组件】通过<xylink-room />组件上报事件消息
     *
     * @param { string } type - 事件type，具有唯一性
     * @param { any } detail - 事件详情
     */
    postEvent(type, detail) {
      this.triggerEvent('onRoomEvent', { type, detail })
    },

    /**
     * 监听XYRTC Client实例上的事件
     */
    initRTCEvent() {
      this.XYClient = XYRTC.createClient()

      this.logger = this.XYClient.getLogger()

      // UI组件实例，内部会掉用此实例上的挂断方法
      // 注意：非UI模式下，开发者不需要调用此方法
      this.XYClient.setComponentInstance(this)
      // 注意：非UI模式下需要调用，将页面实例也SDK绑定，内部创建推拉流实例使用
      this.XYClient.setPageInstance(this)

      // 默认关闭摄像头入会，发送视频关闭通知
      this.onSwitchVideoMute()
      // 默认开启麦克风入会，发送麦克风开启通知
      this.onSwitchAudioMute()

      this.XYClient.on('roomEvent', (e) => {
        const { type, detail } = e

        this.postEvent(type, detail)

        // 非UI模式，直接通过XYClient监听事件即可，不需要通过组件上报
        switch (type) {
          case 'connected':
            // 入会成功事件
            this.logger.log('[component] connected message:', detail)

            this.showComponent()
            break
          case 'rtmpMode':
            this.setPusherConfig()
            break
          case 'onHold':
            // 等候室事件
            this.logger.log('[component] onHold message:', detail)

            this.setData({ onHold: detail })
            break
          case 'pushUrl':
            // 获取到推流地址事件
            this.logger.log('[component] pushUrl message:', detail)

            this.setData(
              {
                pushUrl: detail
              },
              // 切记，需要等待推流地址设置完成后，再启动本地推流
              () => {
                this.XYClient.startLivePusher(
                  () => {
                    this.logger.log('[component]start pusher success')

                    // 非UI模式下（自建），修复iOS开启摄像头入会后再关闭摄像头，远端听不到小程序声音问题
                    // 目的是初始设置camera为关闭状态，等到推流启动后，再开启摄像头
                    this.setData({ isPushed: true })
                  },
                  (err) => {
                    this.logger.log('start pusher failed', err, 'warn')
                  }
                )
              }
            )
            break
          case 'permission':
            // 权限被拒异常处理
            this.logger.log('[component] permission message:', detail)
            // UI模式下，用户第一次拒绝授权麦克风/摄像头权限，需要引导用户授权处理
            // 非UI模式下，开发者可自行选择是否需要处理权限拒绝情况
            this.detectAuthorizeModel()
            break
          case 'layout':
            // 自动布局/自定义布局上报布局结果，基于此数据渲染画面
            this.logger.log('[component] layout message:', detail)
            this.setData({ layout: detail })

            break
          case 'content':
            // 共享Content数据
            this.logger.log('[component] content message:', detail)

            const { callUri = '' } = detail || {}
            const { callUri: preCallUri = '' } = this.content || {}

            if (this.enablePinchToZoom && callUri !== preCallUri) {
              this.setScale(1)
              this.setDragOffset({ x: 0, y: 0 })
            }

            this.content = detail || {}
            break
          case 'audioStatus':
            // 本地实时麦克风状态
            this.logger.log('[component] audioStatus message:', detail)

            this.setData({ muted: detail })
            break
          default:
            break
        }
      })
    },

    /**
     * 挂断会议，清理组件的Template临时数据
     *
     * 注意：非UI模式下，需主动调用XYClient实例上的hangup方法
     *
     * @public
     */
    hangup() {
      this.logger.log('[component] hangup meeting')
      this.resetTemplate()
    },

    // 切换摄像头
    async switchCamera() {
      this.logger.log('[component] switchCamera')

      return await this.XYClient.switchCamera()
    },

    // 设置live-pusher设置
    setPusherConfig() {
      const { pusherConfig } = this.XYClient.getMediaConfig()
      const { maxBitrate, minBitrate, mode } = pusherConfig

      this.logger.log('[component] get pusher config:', pusherConfig)

      this.setData({
        maxBitrate,
        minBitrate,
        mode
      })
    },

    // 显示组件
    showComponent() {
      this.setData({ display: true })
    },

    /**
     *【非UI模式必须调用】绑定live-player状态事件
     *
     * @param { * } e - live-player状态事件
     */
    onPlayStateChange(e) {
      this.XYClient.playerEventHandler(e)

      this.postEvent('playerStatusChange', e)
    },

    /**
     *【非UI模式必须调用】绑定live-pusher状态事件
     *
     * @param { * } e - live-pusher状态事件
     */
    onPusherStateChange(e) {
      this.XYClient.pusherEventHandler(e)

      this.postEvent('roomChange', e.detail)
    },

    /**
     *【非UI模式必须调用】绑定live-pusher网络状态数据
     *
     * @param { * } e -
     */
    onPusherNetStatus(e) {
      this.XYClient.pusherNetStatusHandler(e)
    },

    /**
     *【非UI模式必须调用】绑定live-player网络状态数据
     *
     * @param { * } e - live-pusher网络状态数据事件
     */
    onPlayNetStatus(e) {
      this.XYClient.playNetStatusHandler(e)
    },

    /**
     *【非UI模式必须调用】绑定live-pusher渲染错误事件
     *
     * @param { * } e - live-pusher推流失败事件
     */
    onPusherError(e) {
      this.XYClient.pusherErrorHandler(e)

      this.logger.warn('[component]pusher other error: ', e)
    },

    /**
     *【非UI模式必须调用】绑定麦克风采集的音量大小事件
     *
     * @param { * } e - live-pusher麦克风音量大小事件
     */
    onPusherAudioVolumeNotify(e) {
      this.XYClient.pusherAudioVolumeNotify(e)
    },

    /**
     *【非UI模式必须调用】绑定播放音量大小事件
     *
     * @param { * } e - live-player组件播放音量大小事件
     */
    onPlayAudioVolumeNotify(e) {
      this.XYClient.playAudioVolumeNotify(e)
    },

    /**
     * 重置template
     */
    resetTemplate() {
      this.logger.log('[component] resetTemplate')

      try {
        let template = { layout: 'auto', detail: [] }

        if (this.data.template && JSON.stringify(this.data.template) !== '{}') {
          template = this.data.template
        }
        this.setData({ template })
      } catch (err) {
        this.logger.log('[component] resetTemplate err:', err)
      }
    },

    /**
     * 授权状态更新，需要重新入会
     *
     * @param { string } code - 错误码
     * @param { string } msg - 错误提示
     * @param { object } data - 数据
     */
    exitRoom(key, msg = '', data = null) {
      const response = { code: 'ROOM_EXIT', key, message: msg, data }
      this.logger.log(
        '[component]exit room, send disconnected msg: ',
        response
      )

      this.postEvent('disconnected', response)
    },

    /**
     * 权限确认提示框
     *
     * UI组件模式下代为处理
     * 非UI模式下，需自行在业务上选择处理
     *
     * @private
     */
    detectAuthorizeModel() {
      if (!this.isShowDetected) {
        this.isShowDetected = true

        wx.showModal({
          title: '权限提示',
          content: '请开启“麦克风”和“摄像头”权限才可以进行音视频通话',
          showCancel: true,
          cancelText: '取消',
          cancelColor: '#666666',
          confirmText: '去设置',
          confirmColor: '#3876ff',
          success: (res) => {
            if (res.confirm) {
              // 打开小程序权限设置界面，重新授权
              this.detectAuthorize()
            } else if (res.cancel) {
              // 点击取消，拒绝授权，退会处理
              this.exitRoom('XYSDK:980403', '用户拒绝授权', null)
            }
          }
        })
      }
    },

    /**
     * 检测权限设置，如果没有授权，提示用户设置中授权操作
     *
     * @private
     */
    detectAuthorize() {
      try {
        wx.openSetting({
          success: (res) => {
            const camera = res.authSetting['scope.camera']
            const record = res.authSetting['scope.record']
            this.isShowDetected = false

            if (!camera || !record) {
              this.logger.log('pusher set permission: ', res)

              this.detectAuthorizeModel()
            } else {
              this.logger.log(
                'pusher set permission success: ',
                res.authSetting
              )

              this.exitRoom(
                'XYSDK:980404',
                '手动授权成功，请重新入会',
                res.authSetting
              )
            }
          },
          fail: (error) => {
            this.logger.warn('pusher set permission fail: ', error)

            this.exitRoom('XYSDK:980405', '授权错误', error)
          }
        })
      } catch (err) {
        this.logger.warn('pusher set permission catch error: ', err)
      }
    },

    /**
     * 对某个远端视频画面进行缩放配置，目前仅支持content
     *
     * @param { Object } config - 配置参数
     * @property { string } id - content layoutID
     * @property { Boolean } enablePinchToZoom - 是否可以双指手动缩放
     * @property { 1 | 2 | 3 } scale - 放大倍数，[1,3]
     */
    setViewZoom({ id, enablePinchToZoom, scale }) {
      if (id && this.content.id !== id) {
        return
      }

      if (!this.zoomUtilInstance) {
        this.zoomUtilInstance = new ZoomUtil()
      }

      this.enablePinchToZoom = enablePinchToZoom

      this.setData({
        enablePinchToZoom: enablePinchToZoom
      })

      if (this.zoomUtilInstance && scale) {
        this.zoomUtilInstance.updateZoomScale(scale, this.setScale.bind(this))
      }
    },

    /**
     * 处理content touch事件
     *
     * @private
     * @param {*} fn
     */
    handleTouch(fn) {
      const query = wx.createSelectorQuery().in(this)
      query.select('.xy__video-content').boundingClientRect()
      query.select('.xy__video-live-content').boundingClientRect()

      query.exec((res) => {
        const { width, height } = res[0] || {}
        const { width: outerWidth, height: outerHeight } = res[1] || {}

        const outerDOMSize = { clientWidth: width, clientHeight: height }
        const innerDOMSize = {
          clientWidth: outerWidth,
          clientHeight: outerHeight
        }

        fn(innerDOMSize, outerDOMSize)
      })
    },

    /**
     * 手指触摸动作开始
     *
     * @private
     * @param {*} e
     * @returns
     */
    handleTouchStart(e) {
      if (!this.enablePinchToZoom || !this.zoomUtilInstance) {
        return
      }

      this.handleTouch((innerDOMSize, outerDOMSize) => {
        this.zoomUtilInstance.handleTouchStart(e, innerDOMSize, outerDOMSize)
      })
    },

    /**
     * 手指触摸后移动
     *
     * @private
     * @param {*} e
     * @returns
     */
    handleTouchMove(e) {
      if (!this.enablePinchToZoom || !this.zoomUtilInstance) {
        return
      }

      this.handleTouch((innerDOMSize, outerDOMSize) => {
        this.zoomUtilInstance.handleTouchMove(
          e,
          innerDOMSize,
          outerDOMSize,
          this.setScale.bind(this),
          this.setDragOffset.bind(this)
        )
      })
    },

    /**
     * 手指触摸动作被打断，如来电提醒，弹窗
     *
     * @private
     */
    handleTouchCancel() {
      if (!this.enablePinchToZoom || !this.zoomUtilInstance) {
        return
      }

      this.zoomUtilInstance.handleTouchEnd()
    },

    /**
     * 手指触摸动作结束
     *
     * @private
     */
    handleTouchEnd() {
      if (!this.enablePinchToZoom || !this.zoomUtilInstance) {
        return
      }

      this.zoomUtilInstance.handleTouchEnd()
    },

    /**
     * 设置content scale
     *
     * @private
     */
    setScale(scale) {
      this.setData({ scale })
    },

    /**
     * 设置content移动方向
     *
     * @private
     */
    setDragOffset(dragOffset) {
      this.setData({ dragOffset })
    },

    /**
     * 图片加载失败
     *
     * @private
     * @param {*} e
     */
    getImageError(e) {
      console.log('getImageError:', e)
    }
  }
})
