import { useCallback, useEffect, useMemo, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import {
  BaseEventOrig,
  Image,
  ScrollView,
  Text,
  View
} from '@tarojs/components'
import {
  Button,
  Checkbox,
  ConfigProvider,
  Dialog,
  Form,
  Input,
  Overlay
} from '@nutui/nutui-react-taro'
import { Checked, CheckNormal, Close } from '@nutui/icons-react-taro'
import { useDispatch } from 'react-redux'
import { userActions } from '@/store/slice/user'
import LoginApi from '@/api/login'
import config, { lightTheme } from '@/config'
import { FormData, LoginState } from '@/pages/login/type'
import type * as Res from '@/@type/response'
import Video from './component/Video/index'
import './index.less'

const createFormData = (): FormData => ({
  // userName: '王小',
  // cardNo: '430522198210010031'
  userName: '',
  cardNo: ''
})
export default function Index() {
  const dispatch = useDispatch()
  const [timeLeft, setTimeLeft] = useState(8)
  const [formInstance] = Form.useForm()
  const [form, setForm] = useState(createFormData())
  const [state, setState] = useState<LoginState>({
    controlled: false,
    loading: false,
    videoShow: false,
    successShow: false,
    times: 8,
    timer: 0
  })
  const router = useRouter()

  const disabled = useMemo(
    () => form.userName === '' || form.cardNo === '',
    [form]
  )

  const handleSetFromValue = useCallback(
    (value: string, field: string) => {
      setForm((v) => ({ ...v, [field]: value }))
    },
    [setForm]
  )

  const handleSetDialog = useCallback((value: boolean, field: string) => {
    console.log(field)
    setState((v) => ({ ...v, [field]: value }))
  }, [])

  // const handleScan = useCallback(() => {
  //   Dialog.open('dialog', {
  //     title: '函数式调用',
  //     content: '可通过 Dialog.open 打开对话框',
  //     onConfirm: () => {
  //       Dialog.close('dialog')
  //     },
  //     onCancel: () => {
  //       Dialog.close('dialog')
  //     }
  //   })
  // }, [])

  const handleNavigateTo = useCallback(() => {
    handleSetDialog(false, 'successShow')
    Taro.navigateTo({ url: `/pages/home/index` }).catch(console.log)
  }, [handleSetDialog])

  const handleSubmitSucceed = useCallback(
    () => {
      if (!state.controlled) {
        return Taro.showToast({ title: '请先阅读并勾选用户服务协议', icon: 'none' })
      }
      setState((v) => ({ ...v, loading: true }))
      const { brand, model, system, platform } = Taro.getDeviceInfo()
      const deviceInfo = `${brand},${model},${system},${platform}`
      LoginApi.login({ ...form, deviceInfo }).then((res) => {
        const { data } = res
        if (data) {
          Taro.setStorageSync('userInfo', data)
          dispatch(userActions.setUserInfo(data))
          setState((v) => ({ ...v, successShow: true }))
          Taro.showToast({ title: '请仔细阅读以下注意事项', icon: 'none' }).catch(console.log)
        }
      }).finally(() => {
        setState((v) => ({ ...v, loading: false }))
      })
    },
    [dispatch, form, state.controlled]
  )

  const handleSubmitFailed = useCallback((error) => {
    console.log(error)
  }, [])

  const handleGoPage = useCallback((e: BaseEventOrig, path: string) => {
    e.stopPropagation()
    Taro.navigateTo({ url: path })
  }, [])

  const handleVerifyId = useCallback(async () => {
    Taro.navigateTo({ url: '/pages/collector/card/index' })
    // Taro.showLoading()
    // const { tempFiles } = await Taro.chooseImage({ count: 1 }).catch(hiddenLoadingCatch<ReturnType<typeof Taro.chooseImage>>)
    // if (!tempFiles) {
    //   return
    // }
    // const { data } = await CommonApi.fileUpload(tempFiles[0].path).catch(hiddenLoadingCatch<ReturnType<typeof CommonApi.fileUpload>>)
    // if (!data || !data.url) {
    //   return
    // }
    // await CommonApi.cardOcr({ cardUrl: 'https://img.alicdn.com/tfs/TB1q5IeXAvoK1RjSZFNXXcxMVXa-483-307.jpg' }).then((res) => {
    //   const { data: result } = res
    //   if (result) {
    //     Taro.eventCenter.trigger('ON_OCR_CARD', { ...result })
    //   }
    // }).catch(hiddenLoadingCatch<ReturnType<typeof CommonApi.cardOcr>>)
    // Taro.hideLoading()
  }, [])

  useEffect(() => {
    const { tenantCode = 'ZY001', orgCode = 'Z01' } = router.params
    config.headers.tenantCode = tenantCode
    config.headers.orgCode = orgCode
    console.log(router.params)

    Taro.eventCenter.on('ON_OCR_CARD', (res: Res.CardOcr) => {
      console.log(res)
      setForm(v => ({ ...v, cardNo: res.idNumber, userName: res.name }))
      // formInstance.setFieldsValue({ cardNo: res.idNumber, userName: res.name })
    })
  }, [router.params])

  useEffect(() => {
    if (timeLeft > 0 && state.successShow) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1)
      }, 1000)
      return () => clearInterval(intervalId)
    }
  }, [state.successShow, timeLeft])

  useEffect(() => {
    if (timeLeft === 0) {
      Taro.navigateTo({ url: '/pages/home/index' }).catch(console.log)
     }
  }, [timeLeft])
  return (
    <ConfigProvider theme={lightTheme} className="h-full">
      <View className="h-full flex flex-col justify-between bg-color">
        <View className="flex-shrink-0">
          {/* <NavHeader title="千名千探" back={false} />*/}
          <View className="relative mt-[35px]">
            <View className="absolute left-0 right-0 top-4 mx-auto font-bold text-[20px] text-center text-white">
              远程询问
            </View>
            <Image
              className="w-[374px] h-[286px] block mx-auto"
              src={require('../../assets/img/icon_cen1.png')}
            />
          </View>
          <View className="flex-center text-[14px] font-medium pb-4 text-white pt-2">
            随时随地 · 安全高效
          </View>
        </View>
        <View className="flex-1 rounded-t-xl px-6 bg-form-color">
          <View className="flex items-center justify-between py-5">
            <View className="flex items-center gap-2">
              <Image
                src={require('../../assets/img/icon_logo.png')}
                className="block w-6 h-6"
              />
              <Text className="text-[16px] font-medium">请先进行身份核验</Text>
            </View>
            {/* <View
              className="text-[14px] text-[#3777E1] font-medium"
              onClick={handleScan}
            >
              直接扫描身份证
            </View>*/}
            <View className="flex-col-center gap-[6px] pb-[20px] pt-[20px]">
              <View
                className="flex-center gap-1"
                onClick={() => handleSetDialog(true, 'videoShow')}
              >
                <Image
                  className="w-5 h-5"
                  src={require('../../assets/img/icon_play.png')}
                />
                <Text className="text-[12px] text-[#999999]">使用教程</Text>
              </View>

            </View>
          </View>
          <Form
            form={formInstance}
            starPosition="right"
            initialValues={form}
            onFinish={handleSubmitSucceed}
            onFinishFailed={handleSubmitFailed}
            className="block"
            footer={
              <Button
                block
                type="primary"
                loading={state.loading}
                className="!h-[44px] !rounded"
                color={disabled ? '#9BBBF0' : '#3777E1'}
                disabled={disabled}
                onClick={formInstance.submit}
              >
                登录
              </Button>
            }
          >
            <Form.Item
              label={
                <Image
                  className="w-5 h-5 block rounded"
                  src={require('../../assets/img/icon_user.png')}
                />
              }
              name="userName"
              rules={[
                { min: 2, message: '不能少于2个字' },
                { message: '请输入姓名' }
              ]}
            >
              <View className="flex-center gap-2">
                <Input
                  className="nut-input-text flex-1"
                  placeholder="请输入姓名"
                  type="text"
                  value={form.userName}
                  cursorSpacing={20}
                  onChange={(value) => handleSetFromValue(value, 'userName')}
                />
                <Image
                  onClick={handleVerifyId}
                  className="w-5 h-5 block rounded shrink-0"
                  src={require('../../assets/img/icon_verify.png')}
                />
              </View>
            </Form.Item>
            <Form.Item
              label={
                <Image
                  className="w-5 h-5 block rounded"
                  src={require('../../assets/img/icon_id.png')}
                />
              }
              name="cardNo"
              rules={[
                // { len: 18, message: '请输入18位证件号' },
                { message: '请输入证件号码' }
              ]}
            >
              <View className="flex-center">
                <Input
                  className="nut-input-text"
                  placeholder="请输入证件号码"
                  type="idcard"
                  value={form.cardNo}
                  cursorSpacing={20}
                  onChange={(value) => handleSetFromValue(value, 'cardNo')}
                />
              </View>
            </Form.Item>
          </Form>

          <View className="flex-col-center gap-[6px] pb-[20px] pt-[20px]">
            <View className="flex items-center">
              <Checkbox
                className="!text-[10px] flex items-center gap-1"
                icon={<CheckNormal className="!w-[12px] !h-[12px] text-[#2040ba]" />}
                activeIcon={<Checked className="!w-[12px] !h-[12px] text-[#2040ba]" />}
                label=""
                checked={state.controlled}
                onChange={(val) => setState((v) => ({ ...v, controlled: val }))}
              >
                我已阅读并同意与
                <Text className="text-[#2040ba]" onClick={(e) => handleGoPage(e, '/package/pages/userProtocol/index')}>
                  《用户协议》
                </Text>
                和
                <Text className="text-[#2040ba]" onClick={(e) => handleGoPage(e, '/package/pages/privacyPolicy/index')}>
                  《隐私政策》
                </Text>
              </Checkbox>
            </View>
            <View className="text-[#999999] text-[10px] font-normal flex-center">
              Copyright @ 浙江厚志科技有限公司版权所有
            </View>
          </View>
        </View>
        <Dialog id="dialog" />
        <Dialog
          title={
            <View className="flex justify-center items-center gap-2">
              <Image
                className="w-5 h-5"
                src={require('../../assets/img/icon_waring.png')}
              />
              <Text>警方提示</Text>
            </View>
          }
          visible={state.successShow}
          hideCancelButton
          onConfirm={handleNavigateTo}
          confirmText={<View>继续({timeLeft ?? ''}s)</View>}
        >
          <ScrollView scrollY style={{ height: '300px' }}>
            <View className="flex flex-col gap-3 text-[14px] font-medium my-6">
              <View className="flex">
                <View className="w-2 h-2 rounded-full bg-[#3777E1] ml-1 mt-2 mr-2 flex-shrink-0" />
                <Text>
                  任何情况下执法人员都不会让被询问人转账到指定账户，不会要求提供任何账号密码。
                </Text>
              </View>
              <View className="flex">
                <View className="w-2 h-2 rounded-full bg-[#3777E1] ml-1 mt-2 mr-2 flex-shrink-0" />
                <Text>
                  询问时请选择安静、整洁的环境，并保证手机电量充足，网路畅通，条件允许请优先选择稳定的WiFi上网。为保障询问过程不掉线，请在询问过程中拒接任何来电。
                </Text>
              </View>
              <View className="flex">
                <View className="w-2 h-2 rounded-full bg-[#3777E1] ml-1 mt-2 mr-2 flex-shrink-0" />
                <Text>
                  进入视频时，请特手机环视一周，确保没有其他人员在场或可能被干扰。同时将手机固定并保持一定距离，确保人员一直在视频画面中。
                </Text>
              </View>
              <View className="flex">
                <View className="w-2 h-2 rounded-full bg-[#3777E1] ml-1 mt-2 mr-2 flex-shrink-0" />
                <Text>
                  询问过程中若不慎退出，请重新从公众号或小程序点击进入。
                </Text>
              </View>
            </View>
          </ScrollView>
        </Dialog>

        <Overlay visible={state.videoShow}>
          <View className="h-full flex-col-center gap-4">
            <Video />
            <View className="w-[25px] h-[25px] rounded-full border-[0.5px] border-solid border-[#fff] text-white flex-center" onClick={() => handleSetDialog(false, 'videoShow')}>
              <Close width="10px" height="10px" />
            </View>
          </View>
        </Overlay>
      </View>
    </ConfigProvider>
  )
}
