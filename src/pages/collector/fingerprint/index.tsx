import { useCallback, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { Camera, Image, Text, View } from '@tarojs/components'
import CommonApi from '@/api/common'
import { hiddenLoadingCatch, showOcrCatchToast } from '@/utils'
import './index.less'
import { CollectorCardState } from './type'

export default function Index() {
  const [state, setState] = useState<CollectorCardState>({
    cameraContext: null,
    cameraFlash: 'off',
    cameraUid: '10000'
  })

  const [showExample, setShowExample] = useState<boolean>(false)
  const router = useRouter()
  // 相册初始化成功
  const handleCameraInitDone = useCallback(() => {
    state.cameraContext = Taro.createCameraContext()
  }, [state])

  // 用户未正确授权摄像头
  const handleCameraError = useCallback(() => {
    Taro.showModal({
      title: '需要摄像头授权',
      content: '请允许应用使用你的摄像头，一键识别身份证信息',
      confirmText: '去设置'
    }).then((res) => {
      if (res.confirm) {
        Taro.openSetting().then((result) => {
          // 授权后重新更新camera组件
          if (result.authSetting['scope.camera']) {
            setState((v) => ({
              ...v,
              cameraUid: (+v.cameraUid + 1).toString()
            }))
          }
        })
      }
    })
  }, [])

  /**
   * 上传图片 -- 未正确读取身份证信息则停留当前页面 并提示重拍
   *         -- 正确读取身份证信息则返回上个页面 并带回数据
   */
  const updateFingerUrl = useCallback(
    async (fileUrl: string) => {
      await Taro.showLoading({ title: '识别处理中', mask: true })

      const { data } = await CommonApi.ossFileUpload(fileUrl).catch(
        hiddenLoadingCatch<ReturnType<typeof CommonApi.ossFileUpload>>
      )
      if (!data || !data.url) {
        return
      }
      const { data: updateUrl } = await CommonApi.fingerPrint({
        fingerUrl: data.url
      }).catch(async (err) => {
        if (err.message) {
          return err
        }
        await showOcrCatchToast({ title: '未能识别到有效指纹' })
        return hiddenLoadingCatch<ReturnType<typeof CommonApi.fingerPrint>>(
          err
        )
      })

      if (updateUrl) {
        await CommonApi.updateFingerUrl({
          lawPeopleRecordNumId: router.params.lawPeopleRecordNumId ?? '',
          fingerUrl: updateUrl
        })
          .then(() => {
            Taro.showToast({ title: '指纹捺印上传成功', icon: 'none' })
            setTimeout(() => {
              Taro.navigateBack()
            }, 1500)
          })
          .catch(
            hiddenLoadingCatch<ReturnType<typeof CommonApi.updateFingerUrl>>
          )
      }
    },
    [router.params.lawPeopleRecordNumId]
  )

  const handlerTakePhoto = useCallback(() => {
    if (state.cameraContext !== null) {
      state.cameraContext.takePhoto({
        quality: 'high',
        success: (res) => {
          console.log('拍照： ', res)
          // 每次拍照后camera会自动重置闪光状态为off 这边同步更新记录 避免更新手电筒第一次点击失效
          setState((v) => ({ ...v, cameraFlash: 'off' }))
          if (/:ok$/.test(res.errMsg)) {
            updateFingerUrl(res.tempImagePath)
          }
        },
        fail: () => {}
      })
    } else {
      handleCameraError()
    }
  }, [handleCameraError, state.cameraContext, updateFingerUrl])

  // 打开手电筒
  const handleTorch = useCallback(() => {
    if (state.cameraContext !== null) {
      const value = state.cameraFlash === 'off' ? 'torch' : 'off'
      setState((v) => ({ ...v, cameraFlash: value }))
    } else {
      handleCameraError()
    }
  }, [handleCameraError, state.cameraContext, state.cameraFlash])

  const handleOpenAlbum = useCallback(() => {
    Taro.chooseImage({
      count: 1,
      sourceType: ['album'],
      sizeType: ['original', 'compressed'],
      success: (res) => {
        const prevImg = res.tempFilePaths?.[0] ?? ''
        console.log('选择相册图片：', prevImg)
        updateFingerUrl(prevImg)
      },
      fail: () => {
        console.log('cancel')
      }
    })
  }, [updateFingerUrl])

  return (
    <View className="h-full w-full flex flex-col bg-[#000000]">
      <View className="camera-index">
        <View className="camera-main">
          <Camera
            key={state.cameraUid}
            device-position="back"
            flash={state.cameraFlash}
            frame-size="medium"
            resolution="high"
            onError={handleCameraError}
            onInitDone={handleCameraInitDone}
            className="camera-view"
          />
          <View className="camera-mask">
            <Image
              src={require('@/assets/images/collector/fingerprint_mask.png')}
              mode="scaleToFill"
              className="camera-mask-img"
            />
            <View className="camera-mask-tip">
              <View>参考示例，距离手机后置摄像头</View>
              <View>15-25厘米，点击拍照按钮</View>
            </View>
          </View>
          <View className="example-pos" onClick={() => setShowExample(true)}>
            <Image
              src={require('@/assets/img/icon_example.png')}
              className="example-icon"
            />
            <Text>示例</Text>
          </View>
        </View>
        <View className="camera-controller">
          <View className="camera-controller-tip">
            拍摄要求：确保为本人指纹，包含拳头
          </View>
          <View className="camera-btn-group">
            <View className="camera-btn" onClick={handleTorch}>
              <Image
                src={require('@/assets/images/collector/torch.png')}
                className="torch-img"
              />
            </View>
            <View className="camera-btn-big" onClick={handlerTakePhoto}>
              <View className="camera-btn-big-inner" />
            </View>
            <View className="camera-btn" onClick={handleOpenAlbum}>
              <Image
                src={require('@/assets/images/collector/album.png')}
                className="album-img"
              />
            </View>
          </View>
        </View>
        {showExample ? (
          <View
            className="camera-example-model"
            onClick={() => setShowExample(false)}
          >
            <View className="camera-example">
              <View className="camera-example-title">示例</View>
              <View className="camera-example-content">
                <View className="camera-example-item">
                  <Image
                    src={require('@/assets/images/collector/fingerprint_tip1.png')}
                    className="camera-example-item-value"
                  />
                  <View className="camera-example-item-desc">
                    相机中的大小样式
                  </View>
                </View>
                <View className="camera-example-item">
                  <Image
                    src={require('@/assets/images/collector/fingerprint_tip2.png')}
                    className="camera-example-item-value"
                  />
                  <View className="camera-example-item-desc">
                    识别成功的样式
                  </View>
                </View>
              </View>
            </View>
          </View>
        ) : (
          ''
        )}
      </View>
    </View>
  )
}
