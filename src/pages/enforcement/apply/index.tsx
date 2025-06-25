import { View, Text, Image } from "@tarojs/components";
import { Button, DatePicker, Divider, Form, Input, Picker, PickerOption, TextArea } from '@nutui/nutui-react-taro';
import Description from "../components/Description";
import { useCallback, useEffect, useMemo, useState } from "react";
import type * as Res from '@/@type/response'
import Taro, { useRouter } from "@tarojs/taro";
import CommonApi from '@/api/common'
import EnforcementApi from '@/api/enforcement'
import MultiplePopup from "../components/MultiplePopup";
import { GetRoomListRes, GetUserListRes } from "@/@type/response";
import { InsertLawPoliceReq } from "@/@type/request";
import "./index.less";
import RoomPopup from "../components/RoomPopup";
import { useSelector } from "react-redux";
import { selectUserInfo } from "@/store/slice/user";
import useCreateClient from "../hooks/useCreateClient";

const createFormData = (): InsertLawPoliceReq => ({
  /** 案由 */
  title: '',
  /** 违法地点 */
  lawAddress: '',
  /** 经度 */
  longitude: '',
  /** 纬度 */
  latitude: '',
  /** 违法类型 */
  lawType: '',
  /** 违法行为 */
  lawBehavior: '',
  /** 参与人（协辅警），多个以逗号隔开 */
  joinPeople: '',
  /** 备注 */
  remark: '',
  /** 当事人姓名 */
  partiesName: '',
  /** 当事人身份证号 */
  partiesCard: '',
  /** 当事人电话 */
  partiesPhone: '',
  roomCode: "",
  roomPassword: "",
  /** 违法时间 */
  lawDate: '',
})
export default function Index() {
  const userInfo = useSelector(selectUserInfo)
  const { createClient } = useCreateClient()
  const [formInstance] = Form.useForm()
  const [form, setForm] = useState(createFormData())
  const [showPicker, setPickerShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showLawType, setShowLawType] = useState(false)
  const [showLawBehavior, setShowLawBehavior] = useState(false)
  const [lawTypeList, setLawTypeList] = useState<PickerOption[]>([])
  const [lawBehaviorList, setLawBehaviorList] = useState<PickerOption[]>([])
  /** 参与人选择弹窗 */
  const [showMultiplePopup, setShowMultiplePopup] = useState(false)
  /** 执法室选择弹窗 */
  const [showRoomPopup, setShowRoomPopup] = useState(false)

  const router = useRouter()

  const disabled = useMemo(
    () => form.cardNo === '',
    [form]
  )

  /** 类型对应显示中文 */
  const lawTypeText: string = useMemo(() => {
    return lawTypeList.find((item) => item.value === form.lawType)?.text as string || ''
  }, [form.lawType, lawTypeList])

  /** 违法行为对应中文 */
  const lawBehaviorText: string = useMemo(() => {
    return lawBehaviorList.find((item) => item.value === form.lawBehavior)?.text as string || ''
  }, [form.lawBehavior, lawBehaviorList])

  const handleSetFromValue = useCallback(
    (value: string, field: string) => {
      setForm((v) => ({ ...v, [field]: value }))
      formInstance.setFieldValue(field, value)
    },
    [setForm, form]
  )

  const hanlerPickerConfirm = useCallback(
    (options: PickerOption[], values: (string | number)[]) => {
      console.log(options, values)
      const [year, month, day, hour, minute] = values
      setPickerShow(false)
      handleSetFromValue(
        `${[year, month, day].join('-')} ${[hour, minute, '00'].join(':')}`,
        'lawDate'
      )
    },
    [form]
  )

  const handleLawTypeConfirm = useCallback(
    (options: PickerOption[], values: (string | number)[]) => {
      console.log(options, values)
      const value = options[0].value
      setShowLawType(false)
      if (typeof value === 'string') {
        handleSetFromValue(value, 'lawType')
      }
    },
    [form]
  )
  const handleLawBehaviorConfirm = useCallback(
    (options: PickerOption[], values: (string | number)[]) => {
      console.log(options, values)
      const value = options[0].value
      setShowLawBehavior(false)
      if (typeof value ==='string') {
        handleSetFromValue(value, 'lawBehavior')
      }
    },
    [form]
  )

  /** 打开地图取坐标 */
  const handleOpenMap = useCallback(
    () => {
      console.log('打开地图')
      Taro.chooseLocation({
        success: (res) => {
          console.log(res)
          handleSetFromValue(res.address, 'lawAddress')
          handleSetFromValue(res.longitude.toString(), 'longitude')
          handleSetFromValue(res.latitude.toString(), 'latitude')
        },
        fail: (err) => {
          console.log(err)
        }
      })
    }, [form])

  const handleVerifyId = useCallback(async () => {
    Taro.navigateTo({ url: '/pages/collector/card/index' })
  }, [])

  const handleSubmitSucceed = useCallback(async (formData: InsertLawPoliceReq) => {
    setLoading(true)
    try {
      const res = await EnforcementApi.insertLawPolice(formData)
      console.log('判断是否可用 可用-直接进入取证室，不可用-重新选择取证室', res)
      Taro.showToast({
        title: '发起执法成功',
        icon: 'success'
      })
      const { roomCode, roomPassword, id } = res.data || {};
      setTimeout(() => {
        console.log('发起执法成功，1秒后进入取证室 ', res)
        createClient({
          roomCode: roomCode as string,
          roomPassword: roomPassword as string,
          id: id as string
        }, 'redirectTo')
      }, 1000);
    } catch (error) {
      console.log(error)
      setShowRoomPopup(true)
    } finally {
      setLoading(false)
    }
  }, [form, loading, createClient, setShowRoomPopup])

  const handleRoomConfirm = useCallback((item: GetRoomListRes) => {
    handleSubmitSucceed({
      ...form,
      roomCode: item.roomCode,
      roomPassword: item.roomPassword
    })
  }, [form, handleSubmitSucceed])

  // 提交表单失败回调
  const handleSubmitFailed = useCallback(
    (e: any, errors: any) => {
    console.log('表单提交失败', e, errors)
  }, [form])

  const getLawTypeList = useCallback(async () => {
    return CommonApi.getDictList({type: '11'}).then((res) => {
      const { data } = res
      if (data) {
        setLawTypeList(data.map((item) => ({ text: item.value, value: item.key })));
        // Taro.setStorageSync('REMARK_TEMPLATE', data.xwtzs_remark)
      }
    })
  }, [])

  const getLawBehaviorList = useCallback(async () => {
    return CommonApi.getDictList({type: '12'}).then((res) => {
      const { data } = res
      if (data) {
        setLawBehaviorList(data.map((item) => ({ text: item.value, value: item.key })));
      }
    })
  }, [])

  // useEffect(() => {
  //   if (form.roomCode) {
  //     handleSubmitSucceed()
  //   }
  // }, [handleRoomConfirm])

  useEffect(() => {
    getLawTypeList()
    getLawBehaviorList()
  }, [])

  useEffect(() => {
    const { roomCode, roomPassword } = router.params
    if (roomCode) {
      handleSetFromValue(roomCode, 'roomCode')
    }
    if (roomPassword) {
      handleSetFromValue(roomPassword, 'roomPassword')
    }

    /** 身份证识别回调 */
    Taro.eventCenter.on('ON_OCR_CARD', (res: Res.CardOcr) => {
      console.log(res)
      setForm(v => ({ ...v, partiesCard: res.idNumber, partiesName: res.name }))
    })
    /** 选择协辅警回调 */
    Taro.eventCenter.on('SELECT_USER', (res: { values: string[]; options: GetUserListRes[] }) => {
      console.log(res)
      setForm(v => ({ ...v, joinPeople: res.options.map(item => item.userName).join(',') }))
    })
  }, [router.params])

  return (
    <View className="page-linear h-full w-full flex flex-col bg-[#1F3FBA]">
      <View className="flex-1 flex flex-col px-[15px] py-[16px] border-box overflow-y-auto">
        <Form
          form={formInstance}
          initialValues={form}
          starPosition="left"
          divider
          onFinish={handleSubmitSucceed}
          onFinishFailed={(values, errors) => handleSubmitFailed(values, errors)}
          footer={
            <Button
              className="submit-btn w-full rounded-lg text-[20px]"
              color={disabled ? '#BBB' : '#2766CF'}
              disabled={disabled}
              loading={loading}
              onClick={formInstance.submit}
              >进入执法室</Button>
          }
          >
          <View className="flex flex-col rounded-lg bg-white mb-[10px] px-4 py-2">
            <View className="flex items-center form-group-title mb-[10px]">基本信息</View>
            <Divider/>
            <Form.Item
              label={
                <Text>
                  <Text>案</Text>
                  <Text className="ml-8">由</Text>
                </Text>
              }
              name="title"
              align="flex-start"
              rules={[
                { required: true, message: '请输入案由' },
              ]}
            >
              <Input
                className="nut-input-text flex-1"
                placeholder="请输入案由"
                type="text"
                value={form.title}
                maxLength={50}
                cursorSpacing={20}
                onChange={(value) => handleSetFromValue(value, 'title')}
              />
            </Form.Item>
            <Form.Item
              label='违法时间'
              name="lawDate"
              align="flex-start"
              rules={[
                { required: true, message: '请点击选择时间', trigger: 'onChange' },
              ]}
            >
              <View className="flex-center gap-2" onClick={() => setPickerShow(true)}>
                <Input
                  className="nut-input-text flex-1"
                  placeholder="请点击选择时间"
                  type="text"
                  value={form.lawDate}
                  readOnly
                />
                <Image
                  className="w-5 h-5 block rounded shrink-0"
                  src={require('@/assets/images/enforcement/icon_date.png')}
                />
              </View>
            </Form.Item>
            <Form.Item
              label='违法地点'
              name="lawAddress"
              align="flex-start"
              rules={[
                { required: true, message: '请点击选择地点' },
              ]}
            >
              <View className="flex-center gap-2" onClick={handleOpenMap}>
                <Input
                  className="nut-input-text flex-1"
                  placeholder="请点击选择地点"
                  type="text"
                  value={form.lawAddress}
                  readOnly
                />
                <Image
                  className="w-5 h-5 block rounded shrink-0"
                  src={require('@/assets/images/enforcement/icon_location.png')}
                />
              </View>
            </Form.Item>
            <Form.Item
              label='违法类型'
              name="lawType"
              align="flex-start"
              rules={[
                { required: true, message: '请选择违法类型' },
              ]}
            >
              <View className="flex-center gap-2" onClick={() => setShowLawType(true)}>
                <Input
                  className="nut-input-text flex-1"
                  placeholder="请选择违法类型"
                  type="text"
                  value={lawTypeText}
                  readOnly
                />
                <Image
                  className="w-5 h-5 block rounded shrink-0"
                  src={require('@/assets/images/enforcement/icon_rt_link.png')}
                />
              </View>
            </Form.Item>
            <Form.Item
              label='违法行为'
              name="lawBehavior"
              align="flex-start"
              rules={[
                { required: true, message: '请选择违法行为' },
              ]}
            >
              <View className="flex-center gap-2" onClick={() => setShowLawBehavior(true)}>
                <Input
                  className="nut-input-text flex-1"
                  placeholder="请选择违法行为"
                  type="text"
                  value={lawBehaviorText}
                  readOnly
                />
                <Image
                  className="w-5 h-5 block rounded shrink-0"
                  src={require('@/assets/images/enforcement/icon_rt_link.png')}
                />
              </View>
            </Form.Item>

            <Form.Item
              label={
                <Text>
                  <Text>发</Text>
                  <Text className="ml-2">起</Text>
                  <Text className="ml-2">人</Text>
                </Text>
              }
              align="flex-start"
            >
              {/* <Input
                className="nut-input-text flex-1"
                type="text"
                placeholder=""
                value={userInfo.userName}
                readOnly
              /> */}
              <View className="flex-1">{userInfo.userName}</View>
            </Form.Item>
            <Form.Item
              label={
                <Text>
                  <Text>协</Text>
                  <Text className="ml-2">辅</Text>
                  <Text className="ml-2">警</Text>
                </Text>
              }
              name="joinPeople"
              align="flex-start"
            >
              <View className="flex-center gap-2" onClick={() => setShowMultiplePopup(true)}>
                <Input
                  className="nut-input-text flex-1"
                  placeholder="请点击选择警员"
                  type="text"
                  value={form.joinPeople}
                  readOnly
                />
                <Image
                  className="w-5 h-5 block rounded shrink-0"
                  src={require('@/assets/images/enforcement/icon_fj.png')}
                />
              </View>
            </Form.Item>
            <Form.Item
              label={
                <Text>
                  <Text>备</Text>
                  <Text className="ml-8">注</Text>
                </Text>
              }
              name="remark"
              align="flex-start"
              className="item-textarea no-bottom-driver flex-col items-start"
              rules={[
                { message: '请填写备注信息' },
              ]}
            >
              <TextArea
                placeholder="请填写备注信息"
                className="w-full h-25"
                value={form.remark}
                onChange={(value) => handleSetFromValue(value, 'remark')}
                showCount
                maxLength={200}
                />
            </Form.Item>
          </View>
          <View className="flex flex-col rounded-lg bg-white mb-[10px] px-4 py-2">
            <View className="flex items-center form-group-title mb-[10px]">当事人信息</View>
            <Divider/>
            <Form.Item
              label={
                <Text>
                  <Text>姓</Text>
                  <Text className="ml-8">名</Text>
                </Text>
              }
              name="partiesName"
              align="flex-start"
              rules={[
                { required: true, message: '请输入当事人姓名' },
              ]}
            >
              <Input
                className="nut-input-text flex-1"
                placeholder="请输入当事人姓名"
                type="text"
                value={form.partiesName}
                maxLength={50}
                cursorSpacing={20}
                onChange={(value) => handleSetFromValue(value, 'partiesName')}
              />
            </Form.Item>
            <Form.Item
              label='身份证号'
              name="partiesCard"
              align="flex-start"
              rules={[
                { pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, message: '请输入正确的身份证号' },
              ]}
            >
              <View className="flex-center gap-2">
                <Input
                  className="nut-input-text flex-1"
                  placeholder="扫描身份证自动填入"
                  type="text"
                  value={form.partiesCard}
                  maxLength={20}
                  cursorSpacing={20}
                  onChange={(value) => handleSetFromValue(value, 'partiesCard')}
                />
                <Image
                  onClick={handleVerifyId}
                  className="w-5 h-5 block rounded shrink-0"
                  src={require('@/assets/img/icon_verify.png')}
                />
              </View>
            </Form.Item>
            <Form.Item
              label='联系方式'
              name="partiesPhone"
              align="flex-start"
              className="no-bottom-driver"
              rules={[
                { pattern: /^1[3456789]\d{9}$/, message: '请输入正确的电话号码' },
              ]}
            >
              {/* <View className="flex-center gap-2"> */}
                <Input
                  className="nut-input-text flex-1"
                  placeholder="请输入电话号码"
                  type="text"
                  value={form.partiesPhone}
                  maxLength={11}
                  cursorSpacing={20}
                  onChange={(value) => handleSetFromValue(value, 'partiesPhone')}
                />
              {/* </View> */}
            </Form.Item>
          </View>
        </Form>
        <DatePicker
          title="时间选择"
          type="datetime"
          defaultValue={form.lawDate && new Date(`${form.lawDate.replace(/-/g, '/')}`) || new Date()}
          visible={showPicker}
          onClose={() => setPickerShow(false)}
          onConfirm={(options, values) => hanlerPickerConfirm(options, values)}
        />
        <Picker
          visible={showLawType}
          options={lawTypeList}
          onClose={() => setShowLawType(false)}
          onConfirm={handleLawTypeConfirm}
          />
        <Picker
          visible={showLawBehavior}
          options={lawBehaviorList}
          onClose={() => setShowLawBehavior(false)}
          onConfirm={handleLawBehaviorConfirm}
          />
        <MultiplePopup visible={showMultiplePopup} setVisible={setShowMultiplePopup} />
        <RoomPopup visible={showRoomPopup} setVisible={setShowRoomPopup} onConfirm={handleRoomConfirm} />
      </View>
      <Description />
  </View>
  )
}
