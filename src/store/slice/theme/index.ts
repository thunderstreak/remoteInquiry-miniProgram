import { createEntityAdapter, createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit'
import { ThemeState } from '@/store/slice/theme/type'

// const initialState: ThemeState = { colorScheme: 'light', id: '' }
const themeEntity = createEntityAdapter<ThemeState>()

export const themeSlice = createSlice({
  name: 'theme',
  initialState: themeEntity.getInitialState(),
  reducers: {
    initColorTheme(state) {
      themeEntity.addOne(state, { colorScheme: 'light', id: nanoid() })
    },
    setColorScheme(state, action: PayloadAction<ThemeState>) {
      themeEntity.updateOne(state, {
        id: action.payload.id,
        changes: { colorScheme: action.payload.colorScheme }
      })
    }
  }
})

export const themeActions = themeSlice.actions

export type ThemeSlice = {
  [themeSlice.name]: ReturnType<(typeof themeSlice)['reducer']>;
};

export const themeSelectors = themeEntity.getSelectors<ThemeSlice>(
  (state) => state[themeSlice.name]
)
