import { useCallback, useEffect, useMemo, useState } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import {
  BaseEventOrig,
  Image,
  Text,
  View
} from '@tarojs/components'
import {
  Button,
  Checkbox,
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
import Video from '../Video/index'
import '../../index.less'
import TipDialog from '../TipDialog'

const createFormData = (): FormData => ({
  // userName: '王小',
  // cardNo: '430522198210010031'
  userName: '',
  cardNo: '',
  /** 业务类型（0:公安，1:交警） */
  busType: 1,
  // 登录类型（0:身份证，1:账号+密码，2:短信）
  loginType: 1
})
export default function Index() {
  const HOME_PATH = '/pages/enforcement/list/index'
  const dispatch = useDispatch()
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

  const handleNavigateTo = useCallback(() => {
    handleSetDialog(false, 'successShow')
    Taro.navigateTo({ url: HOME_PATH }).catch(console.log)
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

  return (
    <View className="enforce-login h-full flex flex-col justify-between bg-color">
      <View className="flex-shrink-0">
        {/* <NavHeader title="千名千探" back={false} />*/}
        <View className="relative mt-[35px]">
          <View className="absolute left-0 right-0 top-4 mx-auto font-bold text-[28px] text-center text-white">
            智云易办
          </View>
          <Image
            className="w-[374px] h-[286px] block mx-auto"
            src={require('@/assets/img/icon_cen2.png')}
          />
        </View>
        <View className="flex-center text-[18px] font-medium pb-4 text-white pt-2">
          平安守护 · 安全你我
        </View>
      </View>
      <View className="flex-1 rounded-t-xl px-6 bg-form-color">
        <View className="flex items-center justify-between py-5">
          <View className="flex items-center gap-2">
            <Image
              src={require('@/assets/img/icon_logo.png')}
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
                src={require('@/assets/img/icon_play.png')}
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
            label=''
            name="userName"
            rules={[
              { min: 2, message: '不能少于2个字' },
              { message: '请输入用户名' }
            ]}
          >
            <View className="flex-center gap-2 border border-[#BBB] border-solid rounded-md py-[10px] px-2">
              <Image
                className="w-5 h-5 block"
                src={require('@/assets/img/icon_lg_user.png')}
              />
              <Input
                className="nut-input-text flex-1"
                placeholder="请输入用户名"
                type="text"
                value={form.userName}
                cursorSpacing={20}
                onChange={(value) => handleSetFromValue(value, 'userName')}
              />

            </View>
          </Form.Item>
          <Form.Item
            label=''
            name="cardNo"
            rules={[
              // { len: 18, message: '请输入18位证件号' },
              { message: '请输入密码' }
            ]}
          >
            <View className="flex-center gap-2 border border-[#BBB] border-solid rounded-md py-[10px] px-2">
              <Image
                className="w-5 h-5 block"
                src={require('@/assets/img/icon_lg_pwd.png')}
              />
              <Input
                className="nut-input-text"
                placeholder="请输入密码"
                type="password"
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
      <TipDialog visible={state.successShow} homePath={HOME_PATH} handleNavigateTo={handleNavigateTo} />

      <Overlay visible={state.videoShow}>
        <View className="h-full flex-col-center gap-4">
          <Video />
          <View className="w-[25px] h-[25px] rounded-full border-[0.5px] border-solid border-[#fff] text-white flex-center" onClick={() => handleSetDialog(false, 'videoShow')}>
            <Close width="10px" height="10px" />
          </View>
        </View>
      </Overlay>
    </View>
  )
}
