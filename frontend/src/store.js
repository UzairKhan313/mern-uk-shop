import { configureStore } from '@reduxjs/toolkit'

import { apiSlice } from './slices/apiSlice'
import cartSliceReducer from './slices/cartSlice'
import authSlliceReducer from './slices/authSllice'

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSlliceReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: process.env.NODE_ENV === 'development' ? true : false,
})

export default store
