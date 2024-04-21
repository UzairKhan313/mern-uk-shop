import { apiSlice } from '../slices/apiSlice'
import { ORDERS_URL, PAYPAL_URL } from '../constants'

export const orderApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation({
      query: (order) => ({
        url: ORDERS_URL,
        method: 'POST',
        body: { ...order },
      }),
    }),
    getOrderDetails: builder.query({
      query: (orderId) => {
        return { url: `${ORDERS_URL}/${orderId}` }
      },
      keepUnusedDataFor: 5, // keeping unused data for 5 seconds.
    }),
    payOrder: builder.mutation({
      query: ({ orderId, details }) => {
        return {
          url: `${ORDERS_URL}/${orderId}/pay`,
          method: 'PUT',
          body: { ...details },
        }
      },
    }),

    // Query for getting the paypal client id.
    getPayPalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
      keepUnusedDataFor: 5,
    }),
    getMyOrders: builder.query({
      query: () => ({
        url: `${ORDERS_URL}/mine`,
      }),
      keepUnusedDataFor: 5,
    }),
  }),
})

export const {
  useCreateOrderMutation,
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useGetPayPalClientIdQuery,
  useGetMyOrdersQuery,
} = orderApiSlice
