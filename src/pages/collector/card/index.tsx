import { useCallback, useState } from 'react'
import Taro from '@tarojs/taro'
import { Camera, Image, View } from '@tarojs/components'
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

  // 相册初始化成功
  const handleCameraInitDone = useCallback(() => {
    state.cameraContext = Taro.createCameraContext()
  }, [state])

  // 用户未正确授权摄像头
  const handleCameraError = useCallback(() => {
    Taro.showModal({
      title: '需要摄像头授权',
      content: '请允许应用使用你的摄像头，一键识别身份证信息',
      confirmText: '去设置',
      success: (res) => {
        if (res.confirm) {
          Taro.openSetting({
            success: (res) => {
              // 授权后重新更新camera组件
              if (res.authSetting['scope.camera']) {
                setState((v) => ({
                  ...v,
                  cameraUid: (+v.cameraUid + 1).toString()
                }))
              }
            }
          })
        }
      }
    })
  }, [])

  /**
   * 上传图片 -- 未正确读取身份证信息则停留当前页面 并提示重拍
   *         -- 正确读取身份证信息则返回上个页面 并带回数据
   */
  const updateFingerUrl = useCallback(async (fileUrl: string) => {
    Taro.showLoading({ title: '识别处理中', mask: true })

    const { data } = await CommonApi.fileUpload(fileUrl).catch(
      hiddenLoadingCatch<ReturnType<typeof CommonApi.fileUpload>>
    )
    if (!data || !data.url) {
      return
    }
    await CommonApi.cardOcr({ cardUrl: data.url })
      .then((res) => {
        const { data: result } = res
        if (result) {
          Taro.eventCenter.trigger('ON_OCR_CARD', { ...result })
          Taro.navigateBack()
        }
      })
      .catch(async (err) => {
        if (err.message) {
          return err
        }
        await showOcrCatchToast({ title: '未能识别到身份证' })
        return hiddenLoadingCatch<ReturnType<typeof CommonApi.cardOcr>>(err)
      })
    Taro.hideLoading()
  }, [])

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
      setState((v) => ({
        ...v,
        cameraFlash: value
      }))
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
              src={require('@/assets/images/collector/card_mask.png')}
              mode="aspectFill"
              className="camera-mask-img"
            />
            <View className="camera-mask-tip">
              拍摄要求：清晰完整、四角对齐、无反光、无遮挡
            </View>
          </View>
        </View>
        <View className="camera-controller">
          <View className="camera-controller-tip">
            对准身份证人像面，点击拍照按钮
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
      </View>
    </View>
  )
}
