import { createSlice } from '@reduxjs/toolkit'

import { updateCart } from '../utils/cartUtils'
// setting up the initial state.
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : {
      cartItems: [],
      shippingAddress: {},
      paymentMethod: 'PayPal',
    }

// creating cart slice
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload

      const existItem = state.cartItems.find((p) => p._id === item._id)

      if (existItem) {
        state.cartItems = state.cartItems.map((p) =>
          p._id === existItem._id ? item : p
        )
      } else {
        // we can't use push method because state is immutable.
        // so we make a copy of all the cart items in the state + the new item.
        state.cartItems = [...state.cartItems, item]
      }

      return updateCart(state)
    },
    removeItemFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((p) => p._id !== action.payload)
      return updateCart(state)
    },
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload
      return updateCart(state)
    },
    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload
      return updateCart(state)
    },
    clearCartItems: (state, action) => {
      state.cartItems = []
      return updateCart(state)
    },
    resetCart: (state) => (state = initialState),
  },
})

export const {
  addToCart,
  removeItemFromCart,
  saveShippingAddress,
  savePaymentMethod,
  clearCartItems,
  resetCart,
} = cartSlice.actions
export default cartSlice.reducer
