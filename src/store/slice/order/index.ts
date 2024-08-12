import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { OrderState } from '@/store/slice/order/type'
import { RootState } from '@/store'

const createInitialState = (): OrderState => ({ activityInfo: undefined, ticketsInfo: undefined })

export const orderSlice = createSlice({
  name: 'order',
  initialState: createInitialState(),
  reducers: {
    setOrderData(state: OrderState, action: PayloadAction<Partial<OrderState>>) {
      Object.assign(state, action.payload)
    },
    removeOrderData(state: OrderState) {
      for (const key in state) {
        state[key] = ''
      }
    }
  }
})

export const orderActions = orderSlice.actions
export const selectOrderData = (state: RootState) => state.order
