import { useCallback, useEffect, useMemo, useState } from 'react'
import { Image, ScrollView, Text, View } from '@tarojs/components'
import {
  Button,
  ConfigProvider,
  Dialog,
  Form,
  Input,
  Overlay,
  WaterMark
} from '@nutui/nutui-react-taro'
import { lightTheme } from '@/config'
import { LoginState } from '@/pages/login/type'
import NavHeader from '@/components/NavHeader'
import Video from './component/Video/index'
import './index.less'

const createFormData = () => ({ username: '', idcard: '' })
export default function Index() {
  const [timeLeft, setTimeLeft] = useState(8)
  const [formInstance] = Form.useForm()
  const [form, setForm] = useState(createFormData())
  const [state, setState] = useState<LoginState>({
    videoShow: false,
    successShow: false,
    times: 8,
    timer: 0
  })

  const disabled = useMemo(
    () => form.username === '' || form.idcard === '',
    [form]
  )

  const handleSetFromValue = useCallback(
    (value: string, field: string) => {
      setForm((v) => ({ ...v, [field]: value }))
    },
    [setForm]
  )

  const handleSetDialog = useCallback((value: boolean, field: string) => {
    setState((v) => ({ ...v, [field]: value }))
  }, [])

  const handleScan = useCallback(() => {
    Dialog.open('dialog', {
      title: '函数式调用',
      content: '可通过 Dialog.open 打开对话框',
      onConfirm: () => {
        Dialog.close('dialog')
      },
      onCancel: () => {
        Dialog.close('dialog')
      }
    })
  }, [])

  const handleSubmitSucceed = useCallback((value) => {
    console.log(value)
  }, [])

  const handleSubmitFailed = useCallback((error) => {
    console.log(error)
  }, [])

  useEffect(() => {
    if (timeLeft > 0 && state.successShow) {
      const intervalId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1)
      }, 1000)
      return () => clearInterval(intervalId)
    } else {
      console.log(1)
    }
  }, [state.successShow, timeLeft])
  return (
    <ConfigProvider theme={lightTheme}>
      <WaterMark fullPage content="nutui" />
      <View className="h-full flex flex-col justify-between bg-color">
        <View className="flex-shrink-0">
          <NavHeader title="千名千探" />
          <View className="pt-[37px] font-bold text-[20px] text-center text-white">
            远程云取证系统
          </View>
          <Image src="" className="w-[315px] h-[219px] block mx-auto my-3" />
          <View className="flex-center text-[14px] font-medium pb-[38px] text-white">
            随时随地 · 安全高效
          </View>
        </View>
        <View className="flex-1 rounded-t-xl px-6 bg-form-color">
          <View className="flex items-center justify-between py-5">
            <View className="flex items-center gap-2">
              <Image src="" className="block w-6 h-6" />
              <Text className="text-[16px] font-medium">请先进行身份核验</Text>
            </View>
            <View
              className="text-[14px] text-[#3777E1] font-medium"
              onClick={handleScan}
            >
              直接扫描身份证
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
              label={<View className="w-5 h-5 block rounded bg-user" />}
              name="username"
              rules={[
                { min: 2, message: '不能少于2个字' },
                { message: '请输入姓名' }
              ]}
            >
              <Input
                className="nut-input-text"
                placeholder="请输入姓名"
                type="text"
                value={form.username}
                onChange={(value) => handleSetFromValue(value, 'username')}
              />
            </Form.Item>
            <Form.Item
              label={<View className="w-5 h-5 block rounded bg-id" />}
              name="idcard"
              rules={[
                { len: 18, message: '请输入18位证件号' },
                { message: '请输入证件号码' }
              ]}
            >
              <Input
                className="nut-input-text"
                placeholder="请输入证件号码"
                type="idcard"
                value={form.idcard}
                onChange={(value) => handleSetFromValue(value, 'idcard')}
              />
            </Form.Item>
          </Form>
          <View
            className="flex justify-center items-center gap-1 py-[34px]"
            onClick={() => handleSetDialog(true, 'videoShow')}
          >
            <View className="w-5 h-5 bg-play" />
            <Text className="text-[12px] text-[#999999]">使用教程</Text>
          </View>
        </View>
        <Dialog id="dialog" />
        <Dialog
          title={
            <View className="flex justify-center items-center gap-2">
              <View className="w-5 h-5 bg-waring" />
              <Text>警方提示</Text>
            </View>
          }
          visible={state.successShow}
          hideCancelButton
          onConfirm={() => handleSetDialog(false, 'successShow')}
          confirmText={<View>继续({timeLeft ?? ''}s)</View>}
        >
          <ScrollView scrollY style={{ height: '300px' }}>
            <View className="flex flex-col gap-3 text-[14px] font-medium py-6">
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

        <Overlay
          visible={state.videoShow}
          onClick={() => handleSetDialog(false, 'videoShow')}
        >
          <View className="h-full flex-center">
            <Video />
          </View>
        </Overlay>
      </View>
    </ConfigProvider>
  )
}
