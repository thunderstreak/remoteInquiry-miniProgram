import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { UserState } from '@/store/slice/user/type'
import { RootState } from '@/store'

const createInitialState = (): UserState => ({
  userId: '',
  nickName: '',
  avatar: '',
  userMobile: '',
  sex: '',
  verifyAuth: false
})
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
