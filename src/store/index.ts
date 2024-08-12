import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import {
  addListener,
  configureStore,
  createListenerMiddleware,
  ListenerEffectAPI,
  TypedAddListener,
  TypedStartListening
} from '@reduxjs/toolkit' // import { counterSlice } from '@/store/slice/counter'
import { userSlice } from '@/store/slice/user'
import { appSlice } from '@/store/slice/app'
import { orderSlice } from '@/store/slice/order'

const listenerMiddlewareInstance = createListenerMiddleware({
  onError: () => console.error
})

export const store = configureStore({
  reducer: {
    // [counterSlice.name]: counterSlice.reducer,
    // [themeSlice.name]: themeSlice.reducer,
    [userSlice.name]: userSlice.reducer,
    [appSlice.name]: appSlice.reducer,
    [orderSlice.name]: orderSlice.reducer
  }
  // middleware: (gDM) => gDM().prepend(listenerMiddlewareInstance.middleware)
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
export type AppDispatch = typeof store.dispatch;

export type AppListenerEffectAPI = ListenerEffectAPI<RootState, AppDispatch>;

// @see https://redux-toolkit.js.org/api/createListenerMiddleware#typescript-usage
export type AppStartListening = TypedStartListening<RootState, AppDispatch>;
export type AppAddListener = TypedAddListener<RootState, AppDispatch>;

export const startAppListening =
  listenerMiddlewareInstance.startListening as AppStartListening
export const addAppListener = addListener as AppAddListener

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

// export const selectorKey =
//   <T = AnyType>(key: string) =>
//   (state: RootState) =>
//     parse<T>(key, state as T);

