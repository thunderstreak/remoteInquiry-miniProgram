import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { AppState } from '@/store/slice/app/type'
import { RootState } from '@/store'

const createInitialState = (): AppState => ({ token: '' })

export const appSlice = createSlice({
  name: 'app',
  initialState: createInitialState(),
  reducers: {
    setAppData(state: AppState, action: PayloadAction<Partial<AppState>>) {
      Object.assign(state, action.payload)
    },
    removeAppData(state: AppState) {
      for (const key in state) {
        state[key] = ''
      }
    }
  }
})

export const appActions = appSlice.actions
export const selectAppData = (state: RootState) => state.app
