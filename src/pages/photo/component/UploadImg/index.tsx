import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { Button, ImagePreview, Uploader } from '@nutui/nutui-react-taro'
import { Close } from '@nutui/icons-react-taro'
import { FileItem } from '@nutui/nutui-react-taro/dist/types/packages/uploader/file-item'
import { UploadOptions } from '@nutui/nutui-react-taro/dist/types/packages/uploader/upload'
import { responseText } from '@/pages/photo/type'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import config from '@/config/index'
import { UploadImgProps } from './type'

const createFileItem = (params): FileItem => ({
  name: '',
  url: '',
  uid: '',
  status: 'success',
  message: '上传成功',
  type: 'image',
  ...params
})
const UploadImg: React.FC<UploadImgProps> = (props) => {
  const [showPreview, setShowPreview] = useState(false)
  const [init, setInit] = useState(0)
  const [photo, setPhoto] = useState<FileItem[]>([])
  const previewImages = useMemo(() => photo.map((x) => ({ src: x.url })) as {src: string}[], [photo])
  const handelOnDelete = useCallback((file: FileItem, fileList: FileItem[]) => {
    console.log('delete事件触发', file, fileList)
    setPhoto(fileList)
  }, [])
  const handleOnChange = useCallback((fileList: FileItem[]) => {
    const successList = fileList.filter((x) => x.status === 'success')
    if (successList.length) {
      const list = successList.map(x => {
        const result = x.responseText as XMLHttpRequest['responseText'] as unknown as responseText
        const { data } = JSON.parse(result.data)
        return createFileItem({ url: data.url, uid: data.id, name: data.url })
      })
      setPhoto(list)
    }
  }, [])
  // const handelOnSuccess = useCallback(
  //   (param: {
  //     responseText: XMLHttpRequest['responseText'];
  //     option: UploadOptions;
  //     files: FileItem[];
  //   }) => {
  //     const result = param.responseText as unknown as responseText
  //     try {
  //       const { data } = JSON.parse(result.data)
  //       const file = createFileItem({ url: data.url, uid: data.id, name: data.url })
  //       setPhoto((v) => [...v, file])
  //     } catch (err) {
  //       Taro.showToast({ title: err })
  //     }
  //   },
  //   []
  // )
  const handleOnFailure = useCallback((param: {
    responseText: XMLHttpRequest['responseText'];
    option: UploadOptions;
    files: FileItem[];
  }) => {
    const result = param.responseText
    Taro.showToast({ title: result })
  }, [])

  const handleNext = useCallback(() => {
    if (photo.length) {
      const data = photo.map((x) => ({ url: x.url ?? '', id: x.uid }))
      console.log(data)
      props?.onNext?.({ type: 'UPLOAD', data })
    }
  }, [photo, props])

  const handleOnFileItemClick = useCallback((file: FileItem, index: number) => {
    console.log(file, index)
    setShowPreview(true)
    setInit(index + 1)
  }, [])

  useEffect(() => {
    if (props.value?.length) {
      const list = props.value.map((x, i) => createFileItem({ name: x, url: x, uid: i + new Date().getTime().toString() }))
      setPhoto(list)
    }
  }, [props.value])

  return (
    <View className="px-3 pb-6 flex-1 flex flex-col">
      <View className="flex-1">
        <View className="font-bold text-[14px] pb-3">上传图片（最多27张）</View>
        <Uploader
          value={photo}
          url={`${process.env.TARO_APP_API}/upload/v1/minio/fileUpload`}
          headers={{ 'Content-Type': 'multipart/form-data', ...config.headers }}
          onDelete={handelOnDelete}
          multiple
          onFailure={handleOnFailure}
          onChange={handleOnChange}
          maxCount={27}
          onFileItemClick={handleOnFileItemClick}
        />
      </View>
      <View className="flex-shrink-0">
        <Button
          disabled={!photo.length}
          className={`w-full !h-[44px] rounded-full !text-white ${
            photo.length ? '!bg-[#2766CF] !border-0' : '!bg-[#999999]'
          }`}
          onClick={handleNext}
        >
          下一步
        </Button>
      </View>
      <ImagePreview
        autoPlay={false}
        images={previewImages}
        visible={showPreview}
        value={init}
        defaultValue={init}
        onClose={() => setShowPreview(false)}
        indicator
        closeIcon={<Close />}
        closeIconPosition="bottom"
      />
    </View>
  )
}
export default memo(UploadImg)
