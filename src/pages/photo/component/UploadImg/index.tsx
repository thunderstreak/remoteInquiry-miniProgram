import React, { memo, useCallback, useRef, useState } from 'react'
import { Button, Uploader } from '@nutui/nutui-react-taro'
import { FileItem } from '@nutui/nutui-react-taro/dist/types/packages/uploader/file-item'
import { UploadOptions } from '@nutui/nutui-react-taro/dist/types/packages/uploader/upload'
import { responseText } from '@/pages/photo/type'
import { View } from '@tarojs/components'
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
  const photoRef = useRef<FileItem[]>([])
  const [photo, setPhoto] = useState<FileItem[]>([
    // {
    //   name: '文件文件文件文件1文件文件文件文件1文件文件文件文件1.png',
    //   url: 'https://m.360buyimg.com/babel/jfs/t1/164410/22/25162/93384/616eac6cE6c711350/0cac53c1b82e1b05.gif',
    //   status: 'success',
    //   message: '上传成功',
    //   type: 'image',
    //   uid: '122'
    // }
  ])
  const handelOnDelete = useCallback((file: any, fileList: any) => {
    console.log('delete事件触发', file, fileList)
  }, [])
  const handelOnSuccess = useCallback(
    (param: {
      responseText: XMLHttpRequest['responseText'];
      option: UploadOptions;
      files: FileItem[];
    }) => {
      const result = param.responseText as unknown as responseText
      const { data } = JSON.parse(result.data)
      console.log(data)
      setPhoto((v) => [
        ...v,
        createFileItem({ url: data.url, uid: data.id, name: data.url })
      ])
    },
    []
  )

  const handleNext = useCallback(() => {
    if (photo.length) {
      const data = photo.map((x) => ({ url: x.url ?? '', id: x.uid }))
      console.log(data)
      props?.onNext?.({ type: 'UPLOAD', data })
    }
  }, [photo, props])

  return (
    <View className="px-3 pb-6 flex-1 flex flex-col">
      <View className="flex-1">
        <View className="font-bold text-[14px] pb-3">上传图片（最多27张）</View>
        <Uploader
          value={photoRef.current}
          url={`${process.env.TARO_APP_API}/upload/v1/minio/fileUpload`}
          headers={{ tenantCode: 'ZY001', orgCode: 'Z01' }}
          onDelete={handelOnDelete}
          multiple
          onSuccess={handelOnSuccess}
          maxCount={27}
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
    </View>
  )
}
export default memo(UploadImg)
