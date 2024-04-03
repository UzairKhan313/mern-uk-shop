// Helper function adjusting the prce in a decimal.
export const addDecimals = (num) => {
  return (Math.round(num * 100) / 100).toFixed(2)
}

export const updateCart = (state) => {
  // Calculating the item price.
  state.itemsPrice = addDecimals(
    state.cartItems.reduce((acc, item) => {
      return acc + item.price * item.qty
    }, 0)
  )

  // Calculating the Shipping price. (if  order is over $100 then free else $10 per shipping)
  state.shippingPrice = addDecimals(state.itemsPrice > 100 ? 0 : 10)

  // Calculating the tax price (15% tax).
  state.taxPrice = addDecimals(Number((0.15 * state.itemsPrice).toFixed(2)))

  // Calculating the Total price.
  state.totalPrice = (
    Number(state.itemsPrice) +
    Number(state.shippingPrice) +
    Number(state.taxPrice)
  ).toFixed(2)

  localStorage.setItem('cart', JSON.stringify(state))

  return state
}
