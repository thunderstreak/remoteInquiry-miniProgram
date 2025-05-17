import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserState } from '@/store/slice/user/type'
import { RootState } from '@/store'
import Taro from '@tarojs/taro'

const createInitialState = (): UserState =>
  Taro.getStorageSync<UserState>('userInfo') || {
    id: '',
    tenantCode: '',
    orgCode: '',
    orgName: '',
    cardNo: '',
    userName: '',
    roomCode: '',
    roomPassword: '',
    isExpire: false,
    token: '',
    refreshToken: ''
  }
export const userSlice = createSlice({
  name: 'user',
  initialState: createInitialState(),
  reducers: {
    setUserInfo(state: UserState, action: PayloadAction<Partial<UserState>>) {
      Object.assign(state, action.payload)
    },
    removeUserInfo(state: UserState) {
      for (const key in state) {
        state[key] = ''
      }
    }
  }
})

export const userActions = userSlice.actions
export const selectUserInfo = (state: RootState) => state.user
