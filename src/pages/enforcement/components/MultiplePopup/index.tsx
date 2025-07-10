import { Popup, SearchBar } from "@nutui/nutui-react-taro";
import { View, Image, Text } from "@tarojs/components";
import { useCallback, useEffect, useMemo, useState } from "react";
import EnforceMentApi from '@/api/enforcement'
import { GetUserListRes } from "@/@type/response";
import Taro from "@tarojs/taro";
import { MultiplePopupProps } from "./type";
import './index.less';

export default function Index(props: MultiplePopupProps) {
  const { visible, setVisible } = props
  const [keywords, setKeywords] = useState<string>('')
  const [userList, setUserList] = useState<GetUserListRes[]>([])
  const [checkList, setCheckList] = useState<string[]>([])

  const checkedOptions = useMemo(() => {
    return userList.filter(item => checkList.some(x => x === item.id))
  }, [userList, checkList])

  const handlerClear = useCallback(() => {
    setKeywords('')
    getUserList()
  }, [])

  const handlerSearch = useCallback(() => {
    console.log('搜索')
    setCheckList([])
    getUserList()
  }, [keywords])

  const handlerCheck = useCallback((item: GetUserListRes) => {
    const checkedIndex = checkList.findIndex(x => x === item.id)
    const values = [...checkList]
    if (checkedIndex !== -1) {
      values.splice(checkedIndex, 1)
    } else {
      values.push(item.id)
    }
    setCheckList(values)
  }, [checkList, userList])

  const handlerConfirm = useCallback(() => {
    console.log('确定', checkList)
    Taro.eventCenter.trigger('SELECT_USER', { values: checkList, options: checkedOptions })
    setVisible(false)
  }, [checkList, userList])

  const getUserList = useCallback(() => {
    EnforceMentApi.getUserList({ userName: keywords }).then((res) => {
      console.log('get userlist ', res)
      setUserList(res?.data ?? [])
    })
  }, [keywords, handlerSearch, handlerClear])

  useEffect(() => {
    getUserList()
  }, [])

  return (
    <Popup
        visible={visible}
        position="bottom"
        onClose={() => {
          setVisible(false)
        }}
      >
      <View className="flex-col gap-2 popup-content">
        <View className="flex justify-between text-base px-4 py-[18px]">
          <View onClick={() => setVisible(false)}>取消</View>
          <View className="text-center flex-1 font-medium text-xl">选择协辅警</View>
          <View className="text-[#4d79f2]" onClick={handlerConfirm}>确定</View>
        </View>
        <View className="px-4 mt-1 pb-8">
            <SearchBar
              value={keywords}
              className="h-8 rounded-2xl"
              placeholder="请输入姓名搜索"
              leftIn=''
              right={
                <Image className="w-4 h-4" onClick={() => handlerSearch()} src={require('@/assets/images/enforcement/icon_search.png')}></Image>
              }
              onChange={(value: string) => setKeywords(value)}
              onSearch={handlerSearch}
              onClear={handlerClear}
            />
          <View className="rounded-lg mt-4 bg-[#F8F8F8] px-3 py-3 flex flex-wrap gap-2">
            {/* <View className="flex items-center justify-center w-[100px] h-9 rounded-sm bg-white box-border">
              <Image className="w-4 h-4 mr-2" src={require('@/assets/images/enforcement/icon_fj_text.png')}></Image>
              <Text>张三</Text>
            </View> */}
            {
              userList.map(item => (
                <View
                  className={`flex items-center justify-center w-[100px] h-9 rounded-sm bg-white box-border relative ${checkList.includes(item.id) ? 'border border-solid border-[#4D79F2] text-[#4D79F2]' : ''}`}
                  onClick={() => handlerCheck(item)}
                >
                  {
                    item.type === '2'
                     ? (
                      checkList.includes(item.id)
                        ? (<Image className="w-4 h-4 mr-2" src={require('@/assets/images/enforcement/icon_plc_ac.png')}></Image>)
                        : (<Image className="w-4 h-4 mr-2" src={require('@/assets/images/enforcement/icon_plc.png')}></Image>)
                      )
                     : (
                      checkList.includes(item.id)
                       ? (<Image className="w-4 h-4 mr-2" src={require('@/assets/images/enforcement/icon_fj_text_ac.png')}></Image>)
                       : (<Image className="w-4 h-4 mr-2" src={require('@/assets/images/enforcement/icon_fj_text.png')}></Image>)
                     )
                  }
                  <Text>{item.userName}</Text>
                  { checkList.includes(item.id) &&
                    (<Image className="w-[14px] h-[14px] absolute -right-px -bottom-px" src={require('@/assets/images/enforcement/icon_checked.png')}></Image>)
                  }
                </View>
              ))
            }
            {
              !userList.length && (
                <View className="w-full flex items-center justify-center h-[100px] text-[#999]">
                  <Text>暂无数据</Text>
                </View>
              )
            }
          </View>
          {
            checkedOptions.length ? (
              <View className="leading-lg mt-4">
                <Text className="text-[#999999] mr-2">已选择</Text>
                {
                  checkedOptions.map((item, index) => (
                    <Text className={ index !== 0 ? 'ml-2' : ''}>{item.userName || ''}</Text>
                  ))
                }
              </View>
            ) : ''
          }
        </View>
      </View>
    </Popup>
  )
}
