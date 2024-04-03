import { createSlice } from '@reduxjs/toolkit'

import { updateCart } from '../utils/cartUtils'
// setting up the initial state.
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : {
      cartItems: [],
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
  },
})

export const { addToCart, removeItemFromCart } = cartSlice.actions
export default cartSlice.reducer
