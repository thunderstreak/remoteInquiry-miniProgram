import { wrapperPost } from '@/config/request'
import type * as Res from '@/@type/response'
import type * as Req from '@/@type/request'
import type * as Com from '@/@type/common'
import { UploadResponse } from '@/@type/common'
import Taro from '@tarojs/taro'
import config from '@/config'

class CommonApi {
  /*
   * 获取签字提示内容
   * */
  getSaasInfo = wrapperPost<null, Com.ResponseData<Res.GetSaasInfo>>(
    '/api/v1/saas/getSaasInfo'
  )
  /*
   * 提取的指纹图片
   * */
  fingerPrint = wrapperPost<Req.FingerPrint, Com.ResponseData<Res.FingerPrint>>(
    '/api/v1/aliyun/fingerPrint'
  )
  /*
   * 更新指纹地址
   * */
  updateFingerUrl = wrapperPost<
    Req.UpdateFingerUrl,
    Com.ResponseData<Res.UpdateFingerUrl>
  >('/api/v1/record/updateFingerUrl')

  /*
   * 图片上传
   * */
  fileUpload = (tempFilePath: string) =>
    new Promise((resolve: (data: { data: UploadResponse }) => void, reject) => {
      Taro.uploadFile({
        url: `${process.env.TARO_APP_API}/upload/v1/minio/fileUpload`,
        filePath: tempFilePath,
        name: 'file',
        header: { 'Content-Type': 'multipart/form-data', ...config.headers }
      })
        .then((res) => {
          const { data } = JSON.parse(res.data) as { data: UploadResponse }
          resolve({ data })
        })
        .catch(reject)
    })
}

export default new CommonApi()
