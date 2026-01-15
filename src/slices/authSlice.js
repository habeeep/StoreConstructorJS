import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  email: null,
  verified: false,
  isLoading: true
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail(state, action) {
      state.email = action.payload
      localStorage.setItem('auth', JSON.stringify({ email: state.email, verified: state.verified }))
    },
    setVerified(state, action) {
      state.verified = action.payload
      localStorage.setItem('auth', JSON.stringify({ email: state.email, verified: state.verified }))
    },
    restoreAuth(state, action) {
      state.email = action.payload.email
      state.verified = action.payload.verified
      state.isLoading = false
    },
    setLoading(state, action) {
      state.isLoading = action.payload
    }
  }
})

export const { setEmail, setVerified, restoreAuth, setLoading } = slice.actions
export default slice.reducer
