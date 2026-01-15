import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  themes: [],
  fonts: [],
  backgrounds: [],
  selections: {
    name: '',
    theme: null,
    font: null,
    background: null
  }
}

const slice = createSlice({
  name: 'customizer',
  initialState,
  reducers: {
    setThemes(state, action) { state.themes = action.payload },
    setFonts(state, action) { state.fonts = action.payload },
    setBackgrounds(state, action) { state.backgrounds = action.payload },
    setSelection(state, action) { state.selections = { ...state.selections, ...action.payload } }
  }
})

export const { setThemes, setFonts, setBackgrounds, setSelection } = slice.actions
export default slice.reducer
