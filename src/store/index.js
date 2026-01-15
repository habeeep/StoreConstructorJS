import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../slices/authSlice'
import customizerReducer from '../slices/customizerSlice'

export default configureStore({
  reducer: {
    auth: authReducer,
    customizer: customizerReducer
  }
})
