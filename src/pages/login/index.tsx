import { useCallback, useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import {
  Button,
  ConfigProvider,
  Dialog,
  Form,
  Input,
  Overlay
} from '@nutui/nutui-react-taro'
import { Close } from '@nutui/icons-react-taro'
import { useDispatch } from 'react-redux'
import { userActions } from '@/store/slice/user'
import Login from '@/api/login'
import { lightTheme } from '@/config'
import { FormData, LoginState } from '@/pages/login/type'
import NavHeader from '@/components/NavHeader'
import { useSetting } from '@/hooks/useSetting'
import Video from './component/Video/index'
import './index.less'

const createFormData = (): FormData => ({
  // userName: '余嘉禾',
  // cardNo: '622424198612064432'
  userName: '',
  cardNo: ''
})
export default function Index() {
  const dispatch = useDispatch()
  const [timeLeft, setTimeLeft] = useState(8)
  const [formInstance] = Form.useForm()
  const [form, setForm] = useState(createFormData())
  const [state, setState] = useState<LoginState>({
    loading: false,
    videoShow: false,
    successShow: false,
    times: 8,
    timer: 0
  })
  const { handleSetting } = useSetting()

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
    (value: FormData) => {
      // Taro.showLoading().catch(console.log)
      setState((v) => ({ ...v, loading: true }))
      const { brand, model, system, platform } = Taro.getDeviceInfo()
      const deviceInfo = `${brand},${model},${system},${platform}`
      Login.login({ ...value, deviceInfo }).then((res) => {
        const { data } = res
        if (data) {
          const { token } = data
          Taro.setStorageSync('TOKEN', token)
          dispatch(userActions.setUserInfo(data))
          setState((v) => ({ ...v, successShow: true }))
          Taro.showToast({ title: '请仔细阅读以下注意事项', icon: 'none' }).catch(console.log)
        }
      }).finally(() => {
        // Taro.hideLoading()
        setState((v) => ({ ...v, loading: false }))
      })
    },
    [dispatch]
  )

  const handleSubmitFailed = useCallback((error) => {
    console.log(error)
  }, [])

  useEffect(() => {
    handleSetting().catch(console.log)
  }, [handleSetting])

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
          <NavHeader title="千名千探" back={false} />
          <View className="relative mt-[35px]">
            <View className="absolute left-0 right-0 top-4 mx-auto font-bold text-[20px] text-center text-white">
              远程云取证系统
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
              <Input
                className="nut-input-text"
                placeholder="请输入姓名"
                type="text"
                value={form.userName}
                onChange={(value) => handleSetFromValue(value, 'userName')}
              />
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
              <Input
                className="nut-input-text"
                placeholder="请输入证件号码"
                type="idcard"
                value={form.cardNo}
                onChange={(value) => handleSetFromValue(value, 'cardNo')}
              />
            </Form.Item>
          </Form>
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
            <View className="text-[#999999] text-[10px] font-normal flex-center">
              Copyright @ 浙江厚志科技有限公司
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
